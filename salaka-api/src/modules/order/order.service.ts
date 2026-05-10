import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import * as crypto from 'crypto';
import { CouponService } from '../coupon/coupon.service';
import { CartService } from '../cart/cart.service';
import { CheckoutSummaryRequestDto } from './dto/checkout-summary.dto';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly couponService: CouponService,
        private readonly cartService: CartService,
    ) { }

    /**
     * authoritative calculation of order totals
     */
    async calculatePricing(userId: string, couponCode?: string) {
        // 1. Fetch Cart
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                products: {
                    include: { product: true }
                }
            }
        });

        if (!cart || cart.products.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // 2. Calculate Subtotal & Validate Stock
        let subtotal = 0;
        for (const item of cart.products) {
            if (item.product.stock < item.quantity) {
                throw new BadRequestException(`Insufficient stock for ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`);
            }
            subtotal += item.product.price * item.quantity;
        }

        // 3. Calculate Discount
        let discount = 0;
        if (couponCode) {
            const couponResult = await this.couponService.calculateDiscount(couponCode, userId, subtotal);
            discount = couponResult.discountAmount;
        }

        // 4. Calculate Delivery Charge
        // Fixed Rs. 10 for now, free over 2000
        let deliveryCharge = 10;
        if (subtotal > 2000) {
            deliveryCharge = 0;
        }

        // 5. Total
        const total = subtotal - discount + deliveryCharge;

        return {
            subtotal,
            discount,
            deliveryCharge,
            total,
            products: cart.products
        };
    }

    /**
     * Get summary for frontend display
     */
    async getSummary(userId: string, dto: CheckoutSummaryRequestDto) {
        const pricing = await this.calculatePricing(userId, dto.couponCode);
        return {
            subtotal: pricing.subtotal,
            discount: pricing.discount,
            deliveryCharge: pricing.deliveryCharge,
            total: pricing.total,
        };
    }

    async createOrder(userId: string, createOrderDto: CreateOrderDto) {
        console.log('--- START CREATE ORDER ---', { userId, createOrderDto });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // 1. Calculate pricing (Authoritative)
        const { subtotal, discount, deliveryCharge, total, products } = await this.calculatePricing(userId, createOrderDto.couponCode);

        // 3. Generate Order Number (Human-friendly: ORD-XXXXXX)
        const randomSuffix = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
        const orderNumber = `ORD-${randomSuffix}`;

        // 4. Create Order & OrderItems in Transaction
        return await this.prisma.$transaction(async (tx) => {

            const deadline = new Date();
            deadline.setMinutes(deadline.getMinutes() + 5);

            const order = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    fullName: createOrderDto.fullName,
                    address: createOrderDto.address,
                    phoneNumber: createOrderDto.phoneNumber,
                    subTotal: subtotal,
                    discount: discount,
                    deliveryCharge: deliveryCharge,
                    total,
                    appliedCoupon: createOrderDto.couponCode,
                    paymentProvider: createOrderDto.paymentProvider || 'CashOnDelivery',
                    paymentDeadline: deadline,
                    items: {
                        create: products.map((item) => ({
                            productId: item.productId,
                            name: item.product.name,
                            price: item.product.price,
                            quantity: item.quantity
                        }))
                    },
                    payment: {
                        create: {
                            amount: total,
                            provider: createOrderDto.paymentProvider || 'CashOnDelivery',
                            status: 'Pending',
                        }
                    }
                },
                include: { items: true, payment: true }
            });

            // 4.2 Deduct Stock immediately to reserve it (Atomic Check)
            for (const item of products) {
                const p = await tx.product.findUnique({ where: { id: item.productId } });
                if (!p || p.stock < item.quantity) {
                    throw new BadRequestException(`Insufficient stock for ${item.product?.name || 'product'}.`);
                }

                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                        sold: { increment: item.quantity }
                    }
                });
            }

            // 4.5 Save or Update user's default Shipping Details
            await tx.shippingDetails.upsert({
                where: { userId },
                update: {
                    address: createOrderDto.address,
                    phone: createOrderDto.phoneNumber,
                },
                create: {
                    userId,
                    address: createOrderDto.address,
                    phone: createOrderDto.phoneNumber,
                },
            });

            return order;
        });
    }

    /**
     * Step 3: Finalize Order after payment success
     * Updates status, clears cart, reduces stock permanently
     */
    async finalizeOrder(orderId: string, paymentDetails?: { transactionId?: string; pidx?: string; rawResponse?: any; webhookVerified?: boolean }) {
        this.logger.log(`[OrderService] Finalizing order: ${orderId} with details: ${JSON.stringify(paymentDetails)}`);

        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, payment: true }
        });

        if (!order) throw new NotFoundException('Order not found');
        if (order.payment?.status === 'Paid') return order; // Already finalized

        // STOP payment if order is already cancelled
        if (order.orderStatus === 'Cancelled') {
            this.logger.warn(`[OrderService] Rejecting payment: Order ${order.orderNumber} is already CANCELLED.`);
            throw new BadRequestException('Order was cancelled due to timeout. Please order again.');
        }

        // STRICT CHECK: If 5 mins passed, even if cron hasn't run yet, we reject it
        const now = new Date();
        if (order.paymentDeadline && now > order.paymentDeadline) {
            this.logger.warn(`[OrderService] Rejecting payment: Deadline passed for Order ${order.orderNumber}.`);
            
            // Mark as cancelled immediately if not already
            await this.markPaymentFailed(order.id).catch(() => {}); 
            
            throw new BadRequestException('Payment window (5 mins) expired. Order cancelled.');
        }

        return await this.prisma.$transaction(async (tx) => {
            // 1. Update order and payment status
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    orderStatus: 'Pending',
                    paymentDeadline: null,
                    isRefundPending: false,
                    payment: {
                        update: {
                            status: order.paymentProvider === 'CashOnDelivery' ? 'Pending' : 'Paid',
                            transactionId: paymentDetails?.transactionId,
                            pidx: paymentDetails?.pidx,
                            rawResponse: paymentDetails?.rawResponse,
                            webhookVerified: paymentDetails?.webhookVerified || false,
                        }
                    }
                },
                include: { items: true, payment: true }
            });

            // 2. Clear User Cart
            const cart = await tx.cart.findUnique({ where: { userId: order.userId } });
            if (cart) {
                await tx.cartProduct.deleteMany({ where: { cartId: cart.id } });
            }

            // 3. Record Coupon Usage (if applied)
            if (order.appliedCoupon) {
                const coupon = await tx.couponCode.findUnique({
                    where: { code: order.appliedCoupon }
                });

                if (coupon) {
                    await tx.couponCode.update({
                        where: { id: coupon.id },
                        data: { usageCount: { increment: 1 } }
                    });

                    await tx.useCouponCode.create({
                        data: {
                            userId: order.userId,
                            couponCodeId: coupon.id
                        }
                    });
                }
            }

            console.log(`[OrderService] Order ${order.orderNumber} finalized successfully.`);
            return updatedOrder;
        });
    }

    async getOrders(filters: {
        userId?: string;
        includeArchived?: boolean;
        search?: string;
        status?: string;
        paymentStatus?: string;
        paymentProvider?: string;
        dateFrom?: string;
        dateTo?: string;
        page?: number;
        limit?: number;
    }) {
        const {
            userId,
            includeArchived = false,
            search,
            status,
            paymentStatus,
            paymentProvider,
            dateFrom,
            dateTo,
            page = 1,
            limit = 20,
        } = filters;

        const where: any = {
            ...(userId ? { userId } : {}),
            isArchived: includeArchived,
            ...(status ? { orderStatus: status } : {}),
            ...(paymentStatus ? { payment: { status: paymentStatus as any } } : {}),
            ...(paymentProvider ? { paymentProvider: paymentProvider as any } : {}),
        };

        // Date range filter
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) where.createdAt.gte = new Date(dateFrom);
            if (dateTo) {
                const end = new Date(dateTo);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }

        // Search filter (order number, customer name, phone)
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
                { phoneNumber: { contains: search, mode: 'insensitive' } },
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: {
                    items: { include: { product: true } },
                    user: { select: { firstName: true, lastName: true, email: true } },
                    payment: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getOrderById(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                user: { select: { firstName: true, lastName: true, email: true } },
                cancellations: { orderBy: { createdAt: 'desc' } },
                payment: true
            }
        });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async updateOrderStatus(id: string, status: any, cashCollected?: boolean) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { payment: true }
        });
        if (!order) throw new NotFoundException('Order not found');

        const statusFlow = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        const currentIdx = statusFlow.indexOf(order.orderStatus);
        const newIdx = statusFlow.indexOf(status);

        // Enforce forward-only transitions
        if (currentIdx !== -1 && newIdx !== -1) {
            if (order.orderStatus === 'Delivered') {
                throw new BadRequestException('Cannot change status of a Delivered order. Use "Reopen" if necessary.');
            }
            if (newIdx <= currentIdx) {
                throw new BadRequestException(`Backward transition from ${order.orderStatus} to ${status} is not allowed.`);
            }
        }

        const isCod = order.paymentProvider === 'CashOnDelivery';

        const data: any = { orderStatus: status };

        // COD + Delivered: Use the admin's explicit cashCollected decision
        if (isCod && status === 'Delivered') {
            // cashCollected = true → Paid; cashCollected = false → keep Pending
            const collected = cashCollected === true;
            data.cashCollected = collected;
            data.payment = {
                update: {
                    status: collected ? 'Paid' : 'Pending'
                }
            };
        }

        return this.prisma.order.update({ where: { id }, data });
    }

    async toggleCashCollected(id: string, cashCollected: boolean) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { payment: true }
        });
        if (!order) throw new NotFoundException('Order not found');

        if (order.paymentProvider !== 'CashOnDelivery') {
            throw new BadRequestException('Cash Collected is only applicable for COD orders');
        }

        // Golden Rule COD: If cashCollected, paymentStatus = Paid. If not, Pending.
        const paymentStatus = cashCollected ? 'Paid' : 'Pending';

        return this.prisma.order.update({
            where: { id },
            data: {
                cashCollected,
                payment: {
                    update: {
                        status: paymentStatus as any
                    }
                }
            }
        });
    }

    async archiveOrder(id: string) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');

        return this.prisma.order.update({
            where: { id },
            data: { isArchived: true }
        });
    }

    async unarchiveOrder(id: string) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');

        return this.prisma.order.update({
            where: { id },
            data: { isArchived: false }
        });
    }

    async reopenOrder(userId: string, orderId: string, resetCodPayment = false) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, payment: true }
        });

        if (!order) throw new NotFoundException('Order not found');

        // Only Cancelled or Delivered orders can be reopened
        if (!['Cancelled', 'Delivered'].includes(order.orderStatus)) {
            throw new BadRequestException('Only Cancelled or Delivered orders can be reopened');
        }

        const isCod = order.paymentProvider === 'CashOnDelivery';

        return await this.prisma.$transaction(async (tx) => {
            // 1. If reopening from Cancelled, we MUST re-deduct stock (as it was restored during cancellation)
            if (order.orderStatus === 'Cancelled') {
                for (const item of order.items) {
                    const p = await tx.product.findUnique({ where: { id: item.productId } });
                    if (!p || p.stock < item.quantity) {
                        throw new BadRequestException(`Insufficient stock to reopen order for ${item.name || 'product'}.`);
                    }

                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { decrement: item.quantity },
                            sold: { increment: item.quantity }
                        }
                    });
                }
            }

            const updateData: any = {
                orderStatus: 'Pending',
                isRefundPending: false
            };

            // Rules for COD revert (Mistake delivery)
            if (isCod && order.orderStatus === 'Delivered' && resetCodPayment) {
                updateData.payment = {
                    update: {
                        status: 'Pending'
                    }
                };
                updateData.cashCollected = false;
            }

            // 2. Set Status back to Processing
            return await tx.order.update({
                where: { id: orderId },
                data: updateData
            });
        });
    }

    
    async markPaymentFailed(idOrNumber: string) {
        const cleanId = (idOrNumber || '').trim();
        this.logger.log(`[markPaymentFailed] Attempting to mark order as failed: "${cleanId}"`);

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
        
        // Handle eSewa format where it might append a timestamp: ORD-XXXXXX-123456789
        let searchId = cleanId;
        if (!isUuid && cleanId.includes('-')) {
            const parts = cleanId.split('-');
            if (parts.length > 2) {
                // If it looks like ORD-XXXXXX-TIMESTAMP, strip the timestamp
                searchId = parts.slice(0, 2).join('-');
                this.logger.log(`[markPaymentFailed] Detected suffixed ID, normalized to: "${searchId}"`);
            }
        }

        const order = await this.prisma.order.findFirst({
            where: isUuid ? { id: cleanId } : { orderNumber: searchId },
            include: { items: true, payment: true }
        });

        if (!order) {
            this.logger.error(`[markPaymentFailed] Order NOT FOUND for input: "${cleanId}"`);
            throw new NotFoundException('Order not found');
        }

        this.logger.log(`[markPaymentFailed] Found Order: ${order.orderNumber} | Current Status: ${order.orderStatus} | Payment: ${order.payment?.status}`);

        // If already cancelled/failed, we don't need to do anything (prevents double stock restoration)
        if (order.orderStatus === 'Cancelled' || order.payment?.status === 'Failed') {
            this.logger.log(`[markPaymentFailed] Order ${order.orderNumber} is already in a failed/cancelled state. Skipping.`);
            return order;
        }

        // Only restore stock if it's an online payment that was still Pending
        const isOnlinePayment = ['Esewa', 'Khalti'].includes(order.paymentProvider);
        if (!isOnlinePayment) {
            this.logger.log(`[markPaymentFailed] Order ${order.orderNumber} is not an online payment order. Skipping stock restoration.`);
            return order;
        }

        this.logger.log(`[markPaymentFailed] Proceeding to cancel order and restore stock for ${order.items.length} items.`);

        return await this.prisma.$transaction(async (tx) => {
            // 1. Update order and payment status
            const updatedOrder = await tx.order.update({
                where: { id: order.id },
                data: {
                    orderStatus: 'Cancelled',
                    payment: {
                        update: {
                            status: 'Failed'
                        }
                    }
                }
            });

            // 2. Restore Stock and Decrement Sold Count
            for (const item of order.items) {
                this.logger.log(`[markPaymentFailed] Restoring stock for product ${item.productId}: +${item.quantity}`);
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { increment: item.quantity },
                        sold: { decrement: item.quantity }
                    }
                });
            }

            // 3. Create Cancellation Record
            await tx.orderCancellation.create({
                data: {
                    orderId: order.id,
                    reason: 'Payment cancelled or failed during checkout',
                    cancelledBy: 'system'
                }
            });

            this.logger.log(`[markPaymentFailed] Successfully reverted order ${order.orderNumber} and restored inventory.`);
            return updatedOrder;
        });
    }

    async cancelOrder(userId: string, orderId: string, reason: string, note?: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, payment: true }
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Security: Only owner or Admin can cancel
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const isAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';
        if (order.userId !== userId && !isAdmin) {
            throw new BadRequestException('You do not have permission to cancel this order');
        }

        // Rule: Pending or Processing can be cancelled
        if (!['Pending', 'Processing'].includes(order.orderStatus)) {
            throw new BadRequestException(`Cannot cancel order in ${order.orderStatus} state`);
        }

        return await this.prisma.$transaction(async (tx) => {
            // 1. Restore Product Stock and Sold counts
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { increment: item.quantity },
                        sold: { decrement: item.quantity }
                    }
                });
            }

            // 2. Revert Coupon Usage if applicable
            if (order.appliedCoupon) {
                const coupon = await tx.couponCode.findUnique({
                    where: { code: order.appliedCoupon }
                });

                if (coupon) {
                    // Remove from UseCouponCode
                    await tx.useCouponCode.deleteMany({
                        where: {
                            userId: order.userId,
                            couponCodeId: coupon.id
                        }
                    });

                    // Decrement usageCount
                    await tx.couponCode.update({
                        where: { id: coupon.id },
                        data: { usageCount: { decrement: 1 } }
                    });
                }
            }

            // 3. Create Cancellation Track Record
            const cancelledBy = isAdmin ? 'admin' : 'user';
            await tx.orderCancellation.create({
                data: {
                    orderId,
                    reason: reason || 'Cancelled by user',
                    note,
                    cancelledBy
                }
            });

            // 4. Update Order Status + Payment Status
            const isPaid = order.payment?.status === 'Paid';

            return await tx.order.update({
                where: { id: orderId },
                data: {
                    orderStatus: 'Cancelled',
                    payment: {
                        update: {
                            status: isPaid ? 'Paid' : 'Failed'
                        }
                    },
                    isRefundPending: isPaid
                }
            });
        });
    }

    async getOrderCancellations(orderId: string) {
        return this.prisma.orderCancellation.findMany({
            where: { orderId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getAllCancellations() {
        return this.prisma.orderCancellation.findMany({
            include: {
                order: {
                    select: {
                        orderNumber: true,
                        total: true,
                        paymentProvider: true,
                        user: { select: { firstName: true, lastName: true, email: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }


    /**
     * Background Task: Automatically cancel PENDING online orders after 5 minutes
     * and restore their stock.
     */

    @Cron('0 */5 * * * *')
    async handleExpiredOrders() {
        if (process.env.DISABLE_EXPIRED_ORDERS === 'true') return;


        const currentTime = new Date();
        this.logger.log(`Checking for orders with paymentDeadline past ${currentTime.toISOString()} that are still Pending.`);

        const expiredOrders = await this.prisma.order.findMany({
            where: {
                orderStatus: 'Pending',
                paymentDeadline: { lt: currentTime },
                payment: { status: 'Pending' }
            },
            include: { items: true }
        });

        if (expiredOrders.length === 0) return;

        this.logger.log(`Found ${expiredOrders.length} expired orders. Processing cancellations...`);

        for (const order of expiredOrders) {
            try {
                await this.prisma.$transaction(async (tx) => {
                    // 1. Update status
                    await tx.order.update({
                        where: { id: order.id },
                        data: {
                            orderStatus: 'Cancelled',
                            payment: { update: { status: 'Failed' } }
                        }
                    });

                    // 2. Restore Stock
                    for (const item of order.items) {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: {
                                stock: { increment: item.quantity },
                                sold: { decrement: item.quantity }
                            }
                        });
                    }

                    // 3. Log cancellation
                    await tx.orderCancellation.create({
                        data: {
                            orderId: order.id,
                            reason: 'Payment timeout (Automatic cancellation)',
                            cancelledBy: 'system'
                        }
                    });
                });
                this.logger.log(`Order ${order.orderNumber} automatically cancelled due to timeout.`);
            } catch (error) {
                this.logger.error(`Failed to automatically cancel order ${order.orderNumber}: ${error.message}`);
            }
        }
    }
}
