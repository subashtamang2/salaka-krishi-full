import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EsewaService {
  private readonly logger = new Logger(EsewaService.name);

  constructor(private readonly configService: ConfigService) {}

  private get secretKey() {
    return (this.configService.get<string>('ESEWA_SECRET_KEY') || '8gBm/:&EnhH.1/q').trim();
  }

  private get productCode() {
    return (this.configService.get<string>('ESEWA_PRODUCT_CODE') || 'EPAYTEST').trim();
  }

  private get esewaUrl() {
    return (this.configService.get<string>('ESEWA_URL') || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form').trim();
  }

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
    orderNumber: string;
    orderId: string;
  }) {
    const { amount, orderNumber } = data;
    const total_amount = amount.toString(); // EXACTLY AS IN YOUR WORKING CODE
    const transaction_uuid = `${orderNumber}-${Date.now()}`;

    // Must follow exact order for the signature string
    const signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${this.productCode}`;
    
    this.logger.debug(`[eSewa] Generating signature for: "${signatureString}"`);
    const signature = this.generateSignature(signatureString);

    const corsOrigin = this.configService.get<string>('CORS_ORIGIN') || 'http://localhost:5173';

    return {
      url: this.esewaUrl,
      amount: total_amount,
      tax_amount: '0',
      total_amount: total_amount,
      transaction_uuid: transaction_uuid,
      product_code: this.productCode,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: `${corsOrigin}/esewa-success`,
      failure_url: `${corsOrigin}/esewa-failure`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    };
  }

  /**
   * Verify eSewa payment from base64 encoded string
   */
  async verifyPayment(encodedData: string) {
    try {
      if (!encodedData) {
        throw new BadRequestException('No verification data received');
      }

      const decodedData = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8'));
      this.logger.debug(`[eSewa] Decoded Response: ${JSON.stringify(decodedData)}`);

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
        this.logger.error(`[eSewa] Signature Mismatch! Expected: ${calculatedSignature}, Received: ${signature}`);
        throw new BadRequestException('Invalid eSewa signature');
      }

      // Check status (only for eSewa v2)
      if (decodedData.status && decodedData.status !== 'COMPLETE') {
        this.logger.warn(`[eSewa] Payment not complete. Status: ${decodedData.status} for UUID: ${transaction_uuid}`);
        return {
          success: false,
          transaction_uuid,
          amount: total_amount,
          status: decodedData.status,
          raw: decodedData
        };
      }

      return {
        success: true,
        transaction_uuid,
        amount: total_amount,
        transaction_id: decodedData.transaction_code,
        status: decodedData.status,
        raw: decodedData
      };
    } catch (err) {
      this.logger.error(`[eSewa] Verification Error: ${err.message}`);
      // Re-throw if it's a structural error (like JSON parse or signature)
      // but let verifyAndFinalize handle the higher-level failure
      throw new BadRequestException(err.message || 'Payment verification failed');
    }
  }
}
