import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { PaymentService } from '../payment/payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Step 1: Initiate Order
   * Create a PENDING order and return payment data if online payment is selected.
   */
  async initiateCheckout(userId: string, dto: CreateOrderDto) {
    // 1. Create the order in PENDING status
    const order = await this.orderService.createOrder(userId, dto);
    console.log(`[CheckoutService] Order ${order.orderNumber} initiated with method: ${order.paymentMethod}`);

    const normalizedMethod = (order.paymentMethod || '').toLowerCase();

    // 2. Handle Cash on Delivery (Immediate Finalization)
    if (normalizedMethod === 'cashondelivery') {
      console.log(`[CheckoutService] Finalizing COD for order ${order.orderNumber}`);
      await this.orderService.finalizeOrder(order.id);
      return { 
        order, 
        paymentMethod: 'CashOnDelivery',
        message: 'Order placed successfully (Cash on Delivery)' 
      };
    }

    // 3. Handle Online Payment (Generate Gateway Payloads)
    console.log(`[CheckoutService] Initiating online payment for order ${order.orderNumber} via ${normalizedMethod}`);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const paymentData = await this.paymentService.initiatePayment({
      method: normalizedMethod,
      amount: order.total,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerInfo: {
        name: user?.firstName + (user?.lastName ? ` ${user.lastName}` : ''),
        email: user?.email || '',
        phone: dto.phoneNumber,
      },
      successUrl: normalizedMethod === 'esewa' 
        ? `${process.env.CORS_ORIGIN}/esewa-success` 
        : `${process.env.CORS_ORIGIN}/khalti-success`,
      failureUrl: `${process.env.CORS_ORIGIN}/esewa-failure?orderId=${order.id}`,
    });

    console.log(`[CheckoutService] Payment data generated successfully for ${normalizedMethod}`);

    return {
      order,
      paymentData,
      paymentMethod: normalizedMethod,
    };
  }

  /**
   * Step 2: Verify and Finalize
   * Called by the success callback controllers.
   */
  async verifyAndFinalize(method: 'eSewa' | 'Khalti', data: any) {
    // 1. Verify payment with the gateway
    const verification = await this.paymentService.verifyPayment(method, data);

    if (verification.success) {
      // 2. Extract order number from transaction_uuid (eSewa adds timestamp suffix)
      const sanitizedOrderNumber = method === 'eSewa' 
        ? (verification as any).transaction_uuid.split('-').slice(0, 2).join('-')
        : (verification as any).transaction_uuid;

      const order = await this.prisma.order.findUnique({
        where: { orderNumber: sanitizedOrderNumber }
      });

      if (!order) {
        throw new NotFoundException(`Order ${sanitizedOrderNumber} not found for finalization`);
      }

      // 3. Finalize order (Update DB, Stock, Cart, etc)
      return this.orderService.finalizeOrder(order.id);
    }

    throw new BadRequestException('Payment verification failed at gateway');
  }
}
