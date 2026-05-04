import { Injectable, BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class KhaltiService {
  private readonly logger = new Logger(KhaltiService.name);

  constructor(private readonly configService: ConfigService) {}

  private get secretKey() {
    return this.configService.get<string>('KHALTI_SECRET_KEY');
  }

  private get initiateUrl() {
    return this.configService.get<string>('KHALTI_INITIATE_URL') || 'https://a.khalti.com/api/v2/epayment/initiate/';
  }

  private get verifyUrl() {
    return this.configService.get<string>('KHALTI_LOOKUP_URL') || 'https://a.khalti.com/api/v2/epayment/lookup/';
  }

  async initiatePayment(data: {
    amount: number;
    orderId: string;
    orderName: string;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
    };
  }) {
    if (!this.secretKey) {
      throw new InternalServerErrorException('Khalti secret key not configured');
    }

    const corsOrigin = this.configService.get<string>('CORS_ORIGIN') || 'http://localhost:5173';

    const payload = {
      return_url: `${corsOrigin}/khalti-success`,
      website_url: corsOrigin,
      amount: Math.round(data.amount * 100), // convert to paisa
      purchase_order_id: data.orderId,
      purchase_order_name: data.orderName,
      customer_info: data.customerInfo,
    };

    try {
      const response = await fetch(this.initiateUrl, {
        method: "POST",
        headers: {
          Authorization: `Key ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        this.logger.error('Khalti Initiation Failed:', result);
        throw new BadRequestException(result.message || 'Khalti initiation failed');
      }

      return result;
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error('Khalti API Error:', error.message);
      throw new InternalServerErrorException(`Khalti Error: ${error.message}`);
    }
  }

  async verifyPayment(pidx: string) {
    if (!pidx) {
        throw new BadRequestException('Khalti pidx missing');
    }

    if (!this.secretKey) {
      throw new InternalServerErrorException('Khalti secret key not configured');
    }

    try {
      const response = await fetch(this.verifyUrl, {
        method: "POST",
        headers: {
          Authorization: `Key ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      });

      const result = await response.json();
      if (!response.ok) {
        this.logger.error('Khalti Verification Failed:', result);
        throw new BadRequestException(result.detail || 'Khalti verification failed');
      }

      return {
        success: result.status === 'Completed',
        transaction_id: result.transaction_id,
        pidx: result.pidx,
        amount: result.total_amount / 100, // convert back to Rs.
        status: result.status,
        raw: result
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error('Khalti Verification Error:', error.message);
      throw new InternalServerErrorException(`Khalti Verification Error: ${error.message}`);
    }
  }
}
