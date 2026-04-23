import { Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class KhaltiService {
  private secretKey = process.env.KHALTI_SECRET_KEY;
  private initiateUrl = process.env.KHALTI_INITIATE_URL || 'https://a.khalti.com/api/v2/epayment/initiate/';
  private verifyUrl = process.env.KHALTI_LOOKUP_URL || 'https://a.khalti.com/api/v2/epayment/lookup/';

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

    const payload = {
      return_url: process.env.KHALTI_RETURN_URL || `${process.env.CORS_ORIGIN}/khalti-success`,
      website_url: process.env.CORS_ORIGIN || 'http://localhost:5173',
      amount: Math.round(data.amount * 100), // paisa
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
        throw new BadRequestException(result.message || 'Khalti initiation failed');
      }

      return result;
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(`Khalti Error: ${error.message}`);
    }
  }

  async verifyPayment(pidx: string) {
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
        throw new BadRequestException(result.message || 'Khalti verification failed');
      }

      return {
        success: result.status === 'Completed',
        transaction_id: result.transaction_id,
        amount: result.total_amount / 100, // back to rs
        raw: result
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(`Khalti Verification Error: ${error.message}`);
    }
  }
}
