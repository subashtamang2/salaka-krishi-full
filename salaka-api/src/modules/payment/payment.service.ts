import { Injectable, BadRequestException, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { EsewaService } from "./esewa.service";
import { KhaltiService } from "./khalti.service";
import { OrderService } from "../order/order.service";

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly esewaService: EsewaService,
    private readonly khaltiService: KhaltiService,
    private readonly orderService: OrderService
  ) {}

  /**
   * Initiate payment with a specific provider
   */
  async initiatePayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true }
    });

    if (!order) throw new NotFoundException('Order not found');
    
    // Safety check: Don't initiate if already paid
    if (order.payment?.status === 'Paid') {
      throw new BadRequestException('Order is already paid');
    }

    const method = order.paymentProvider.toLowerCase();

    // LOCK order status before redirecting to payment gateway
    if (method === 'esewa') {
      return this.esewaService.createPaymentPayload({
        amount: order.total,
        orderNumber: order.orderNumber,
        orderId: order.id
      });
    }

    if (method === 'khalti') {
      const user = await this.prisma.user.findUnique({ where: { id: order.userId } });
      return this.khaltiService.initiatePayment({
        amount: order.total,
        orderId: order.orderNumber, 
        orderName: `Order #${order.orderNumber}`,
        customerInfo: {
          name: `${user?.firstName} ${user?.lastName || ''}`.trim(),
          email: user?.email || '',
          phone: order.phoneNumber,
        }
      });
    }

    if (method === 'cashondelivery') {
        return { message: 'Cash on Delivery selected' };
    }

    throw new BadRequestException(`Unsupported payment method: ${order.paymentProvider}`);
  }

  /**
   * Verify payment and finalize order
   * This is called by both Redirects and Webhooks
   */
  async verifyAndFinalize(provider: 'Esewa' | 'Khalti', data: any, isWebhook = false) {
    this.logger.log(`Verifying ${provider} payment. Source: ${isWebhook ? 'Webhook' : 'Redirect'}`);

    let verificationResult;
    let orderNumber;

    if (provider === 'Esewa') {
      // eSewa sends a base64 encoded 'data' string
      verificationResult = await this.esewaService.verifyPayment(data.data);
      // eSewa transaction_uuid usually contains our order number
      // We append a timestamp in initiate, so we need to strip it
      const parts = verificationResult.transaction_uuid.split('-');
      orderNumber = parts.slice(0, -1).join('-'); 
    } else {
      // Khalti sends 'pidx'
      verificationResult = await this.khaltiService.verifyPayment(data.pidx);
      orderNumber = data.purchase_order_id || verificationResult.raw?.purchase_order_id;
    }

    if (!verificationResult.success) {
      this.logger.warn(`[PaymentService] ${provider} verification explicitly failed. Status: ${verificationResult.status}. Marking order as failed.`);
      
      if (orderNumber) {
          const order = await this.prisma.order.findUnique({ where: { orderNumber } });
          if (order) {
              await this.orderService.markPaymentFailed(order.id);
          }
      }
      
      throw new BadRequestException(`${provider} verification failed. Status: ${verificationResult.status}`);
    }

    // Find the order
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: { payment: true }
    });

    if (!order) {
      this.logger.error(`Order ${orderNumber} not found for ${provider} verification`);
      throw new NotFoundException(`Order ${orderNumber} not found`);
    }

    // --- STRICT VALIDATION ---
    // 1. Verify Amount matches
    const paidAmount = Number(verificationResult.amount);
    const expectedAmount = Number(order.total);
    
    // Allowing 1 unit difference for potential rounding issues in gateways
    if (Math.abs(paidAmount - expectedAmount) > 1) {
      this.logger.error(`Amount mismatch for Order ${order.orderNumber}. Expected: ${expectedAmount}, Paid: ${paidAmount}`);
      throw new BadRequestException('Payment amount mismatch');
    }

    // 2. Finalize the order
    const paymentDetails = {
      transactionId: verificationResult.transaction_id || verificationResult.raw?.transaction_code,
      pidx: verificationResult.pidx || verificationResult.raw?.pidx,
      rawResponse: verificationResult.raw,
      webhookVerified: isWebhook
    };

    return this.orderService.finalizeOrder(order.id, paymentDetails);
  }
}
