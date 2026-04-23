import { Injectable, BadRequestException } from "@nestjs/common";
import { EsewaService } from "./esewa/esewa.service";
import { KhaltiService } from "./khalti/khalti.service";

@Injectable()
export class PaymentService {
  constructor(
    private readonly esewaService: EsewaService,
    private readonly khaltiService: KhaltiService
  ) {}

  async initiatePayment(data: {
    method: 'eSewa' | 'Khalti' | string;
    amount: number;
    orderId: string;
    orderNumber: string;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
    };
    successUrl: string;
    failureUrl: string;
  }) {
    const method = data.method.toLowerCase();

    if (method === 'esewa') {
      return this.esewaService.createPaymentPayload({
        amount: data.amount,
        transaction_uuid: `${data.orderNumber}-${Date.now()}`,
        success_url: data.successUrl,
        failure_url: data.failureUrl,
      });
    }

    if (method === 'khalti') {
      return this.khaltiService.initiatePayment({
        amount: data.amount,
        orderId: data.orderNumber,
        orderName: `Order #${data.orderNumber}`,
        customerInfo: data.customerInfo,
      });
    }

    throw new BadRequestException(`Unsupported payment method: ${data.method}`);
  }

  async verifyPayment(method: string, verifyData: any) {
    const sanitizedMethod = method.toLowerCase();

    if (sanitizedMethod === 'esewa') {
      return this.esewaService.verifyPayment(verifyData.data);
    }

    if (sanitizedMethod === 'khalti') {
      return this.khaltiService.verifyPayment(verifyData.pidx);
    }

    throw new BadRequestException(`Unsupported payment method: ${method}`);
  }
}
