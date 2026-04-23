import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import * as crypto from 'crypto';

import { CouponService } from '../coupon/coupon.service';

import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couponService: CouponService,
    private readonly cartService: CartService,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    console.log('--- START CREATE ORDER ---', { userId, createOrderDto });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // 1. Get User's Cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        products: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.products.length === 0) {
      console.log('Cart is empty for user:', userId);
      throw new BadRequestException('Cart is empty');
    }
    console.log('Cart found with items:', cart.products.length);

    // 2. Calculate Totals
    const subTotal = cart.products.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    let total = subTotal;
    let discountAmount = 0;

    // 2.1 Handle Coupon Validation & Calculation
    if (createOrderDto.couponCode) {
      const couponResult = await this.couponService.calculateDiscount(
        createOrderDto.couponCode,
        userId,
        subTotal
      );
      discountAmount = couponResult.discountAmount;
      total = couponResult.finalTotal;
    }

    // 3. Generate Order Number
    const orderNumber = `ORD-${Date.now()}`;

    // 4. Create Order & OrderItems in Transaction
    return await this.prisma.$transaction(async (tx) => {
      // 4.1 Record Coupon Usage (Only if not eSewa or Khalti)
      const isOnlinePayment = ['eSewa', 'Khalti'].includes(createOrderDto.paymentMethod || '');
      
      if (createOrderDto.couponCode && !isOnlinePayment) {
        const coupon = await tx.couponCode.findUnique({
          where: { code: createOrderDto.couponCode }
        });

        if (coupon) {
          // Increment usage count
          await tx.couponCode.update({
            where: { id: coupon.id },
            data: { usageCount: { increment: 1 } }
          });

          // Mark as used by user
          await tx.useCouponCode.create({
            data: {
              userId,
              couponCodeId: coupon.id
            }
          });
        }
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          fullName: createOrderDto.fullName,
          address: createOrderDto.address,
          phoneNumber: createOrderDto.phoneNumber,
          subTotal,
          discount: discountAmount,
          total,
          appliedCoupon: createOrderDto.couponCode,
          paymentMethod: createOrderDto.paymentMethod || 'CashOnDelivery',
          items: {
            create: cart.products.map((item) => ({
              productId: item.productId,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity
            }))
          }
        },
        include: { items: true }
      });

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
   * Finalize the order: Update stock, clear cart, and record coupon usage in a transaction.
   * This is called by the Checkout orchestrator after payment verification.
   */
  async finalizeOrder(orderId: string) {
    console.log(`[OrderService] Finalizing order: ${orderId}`);
    
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.paymentStatus === 'Paid') return order; // Already finalized

    return await this.prisma.$transaction(async (tx) => {
      // 1. Update order and payment status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'Paid',
          orderStatus: 'Processing',
        },
        include: { items: true }
      });

      // 2. Update Product Stock and Sold counts
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            sold: { increment: item.quantity }
          }
        });
      }

      // 3. Clear User Cart
      const cart = await tx.cart.findUnique({ where: { userId: order.userId } });
      if (cart) {
        await tx.cartProduct.deleteMany({ where: { cartId: cart.id } });
      }

      // 4. Record Coupon Usage (if applied)
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
    paymentMethod?: string;
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
      paymentMethod,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = filters;

    const where: any = {
      ...(userId ? { userId } : {}),
      ...(includeArchived ? {} : { isArchived: false }),
      ...(status ? { orderStatus: status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      ...(paymentMethod ? { paymentMethod } : {}),
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
          user: { select: { firstName: true, lastName: true, email: true } }
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
        cancellations: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
  
  async updateOrderStatus(id: string, status: any, cashCollected?: boolean) {
    const order = await this.prisma.order.findUnique({ where: { id } });
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

    const isCod = order.paymentMethod === 'CashOnDelivery';

    const data: any = { orderStatus: status };

    // COD + Delivered: Use the admin's explicit cashCollected decision
    if (isCod && status === 'Delivered') {
      // cashCollected = true → Paid; cashCollected = false → keep Pending
      const collected = cashCollected === true;
      data.cashCollected = collected;
      data.paymentStatus = collected ? 'Paid' : 'Pending';
    }

    return this.prisma.order.update({ where: { id }, data });
  }

  async toggleCashCollected(id: string, cashCollected: boolean) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    if (order.paymentMethod !== 'CashOnDelivery') {
      throw new BadRequestException('Cash Collected is only applicable for COD orders');
    }

    // Golden Rule COD: If cashCollected, paymentStatus = Paid. If not, Pending.
    const paymentStatus = cashCollected ? 'Paid' : 'Pending';

    return this.prisma.order.update({
      where: { id },
      data: { cashCollected, paymentStatus }
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

  async reopenOrder(userId: string, orderId: string, resetCodPayment = false) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) throw new NotFoundException('Order not found');
    
    // Only Cancelled or Delivered orders can be reopened
    if (!['Cancelled', 'Delivered'].includes(order.orderStatus)) {
      throw new BadRequestException('Only Cancelled or Delivered orders can be reopened');
    }

    const isCod = order.paymentMethod === 'CashOnDelivery';

    return await this.prisma.$transaction(async (tx) => {
      // 1. If reopening from Cancelled, we MUST re-deduct stock (as it was restored during cancellation)
      if (order.orderStatus === 'Cancelled') {
        for (const item of order.items) {
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
        orderStatus: 'Processing',
        cancellationReason: null,
        isRefundPending: false
      };

      // Rules for COD revert (Mistake delivery)
      if (isCod && order.orderStatus === 'Delivered' && resetCodPayment) {
        updateData.paymentStatus = 'Pending';
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
    console.log(`[markPaymentFailed] Attempting to mark payment failed for: ${idOrNumber}`);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrNumber);
    const order = await this.prisma.order.findFirst({ 
      where: isUuid ? { id: idOrNumber } : { orderNumber: idOrNumber }
    });
    
    if (!order) {
      console.error(`[markPaymentFailed] Order not found: ${idOrNumber}`);
      throw new NotFoundException('Order not found');
    }
    
    console.log(`[markPaymentFailed] Found order ${order.orderNumber}. Current status: paymentStatus=${order.paymentStatus}, orderStatus=${order.orderStatus}`);

    // Only update if it's pending online payment
    if (order.paymentStatus === 'Pending' && ['eSewa', 'Khalti'].includes(order.paymentMethod)) {
      console.log(`[markPaymentFailed] Order is eligible for cancellation. Updating database...`);
      return await this.prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'Failed',
            orderStatus: 'Cancelled',
          }
        });

        await tx.orderCancellation.create({
          data: {
            orderId: order.id,
            reason: 'Payment cancelled or failed during checkout',
            cancelledBy: 'system'
          }
        });

        console.log(`[markPaymentFailed] Successfully updated order ${order.orderNumber} to Cancelled/Failed.`);
        return updatedOrder;
      });
    }

    console.log(`[markPaymentFailed] Order was NOT updated. Either not Pending or not eSewa/Khalti.`);
    return order;
  }

  async cancelOrder(userId: string, orderId: string, reason: string, note?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
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

    // Rule: Only Pending or Processing can be cancelled
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
      const isPaid = order.paymentStatus === 'Paid';
      
      return await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: 'Cancelled',
          paymentStatus: isPaid ? 'Paid' : 'Failed',
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
            paymentMethod: true,
            user: { select: { firstName: true, lastName: true, email: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
