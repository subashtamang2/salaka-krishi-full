import { Injectable, BadRequestException } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class EsewaService {
  private secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
  private productCode = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
  private esewaUrl = process.env.ESEWA_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

  /**
   * Generate HMAC SHA256 signature for eSewa
   */
  private generateSignature(message: string): string {
    return crypto
      .createHmac("sha256", this.secretKey)
      .update(message)
      .digest("base64");
  }

  /**
   * Create eSewa payment payload
   */
  createPaymentPayload(data: {
    amount: number;
    transaction_uuid: string;
    success_url: string;
    failure_url: string;
  }) {
    const { amount, transaction_uuid, success_url, failure_url } = data;
    const total_amount = amount.toString();

    // Must follow exact order for the signature string
    const signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${this.productCode}`;
    const signature = this.generateSignature(signatureString);

    return {
      url: this.esewaUrl,
      amount: total_amount,
      tax_amount: '0',
      total_amount: total_amount,
      transaction_uuid: transaction_uuid,
      product_code: this.productCode,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url,
      failure_url,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    };
  }

  /**
   * Verify eSewa payment from base64 encoded string
   */
  async verifyPayment(encodedData: string) {
    try {
      const decodedData = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8'));
      const { total_amount, transaction_uuid, product_code, signature, signed_field_names } = decodedData;

      let signatureString = '';
      if (signed_field_names) {
        const fields = signed_field_names.split(',');
        const parts = fields.map(field => `${field}=${decodedData[field] || ''}`);
        signatureString = parts.join(',');
      } else {
        signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${this.productCode}`;
      }

      const calculatedSignature = this.generateSignature(signatureString);

      if (calculatedSignature !== signature) {
        throw new BadRequestException('Invalid eSewa signature');
      }

      // Check status (only for eSewa v2)
      if (decodedData.status && decodedData.status !== 'COMPLETE') {
        throw new BadRequestException(`Payment incomplete. Status: ${decodedData.status}`);
      }

      return {
        success: true,
        transaction_uuid,
        amount: total_amount,
        raw: decodedData
      };
    } catch (err) {
      console.error('[EsewaService] Verification Error:', err);
      throw new BadRequestException(err.message || 'Payment verification failed');
    }
  }
}
