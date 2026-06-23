import { Injectable } from '@nestjs/common';
import { OrderService } from './order.service';
import { PaymentService } from '../payment/payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CheckoutSummaryRequestDto } from './dto/checkout-summary.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * Get summary for frontend display
   */
  async getSummary(userId: string, dto: CheckoutSummaryRequestDto) {
    return this.orderService.getSummary(userId, dto);
  }

  /**
   * Step 1: Initiate Checkout
   * Create a PENDING order and return payment data if online payment is selected.
   */
  async initiateCheckout(userId: string, dto: CreateOrderDto) {
    // 1. Create the order in PENDING status
    const order = await this.orderService.createOrder(userId, dto);

    const normalizedMethod = (order.paymentProvider || '').toLowerCase();

    // 2. Handle Cash on Delivery (Immediate Finalization)
    if (normalizedMethod === 'cashondelivery') {
      await this.orderService.finalizeOrder(order.id);
      return {
        order,
        paymentProvider: 'CashOnDelivery',
        message: 'Order placed successfully (Cash on Delivery)'
      };
    }

    // 3. Handle Online Payment (Delegate to PaymentService)
    const paymentData = await this.paymentService.initiatePayment(order.id);

    return {
      order,
      paymentData,
      paymentProvider: order.paymentProvider,
    };
  }

  /**
   * Step 2: Verify and Finalize
   * Delegated to PaymentService
   */
  async verifyAndFinalize(method: 'Esewa' | 'Khalti', data: any) {
    return this.paymentService.verifyAndFinalize(method, data, false);
  }
}
