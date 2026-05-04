import { Controller, Get, Post, Body, Query, Res, Logger } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import type { Response } from "express";
import { ConfigService } from "@nestjs/config";

@ApiTags('Payment')
@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService
  ) {}

  /**
   * eSewa Redirect Handler (GET)
   * The browser is redirected here after payment
   */
  @Get('esewa/callback')
  @ApiOperation({ summary: 'eSewa redirect callback' })
  async esewaCallback(@Query('data') data: string, @Res() res: Response) {
    try {
      await this.paymentService.verifyAndFinalize('Esewa', { data }, false);
      return res.redirect(`${this.configService.get('CORS_ORIGIN')}/payment-success`);
    } catch (error) {
      this.logger.error(`eSewa callback error: ${error.message}`);
      return res.redirect(`${this.configService.get('CORS_ORIGIN')}/payment-failure?error=${encodeURIComponent(error.message)}`);
    }
  }

  /**
   * eSewa Webhook Handler (POST)
   * eSewa server calls this directly
   */
  @Post('esewa/webhook')
  @ApiOperation({ summary: 'eSewa server-to-server webhook' })
  async esewaWebhook(@Body() body: any) {
    // eSewa might send 'data' in body for POST
    const data = body.data;
    await this.paymentService.verifyAndFinalize('Esewa', { data }, true);
    return { status: 'success' };
  }

  /**
   * Khalti Redirect Handler (GET)
   */
  @Get('khalti/callback')
  @ApiOperation({ summary: 'Khalti redirect callback' })
  async khaltiCallback(
    @Query('pidx') pidx: string, 
    @Query('purchase_order_id') purchase_order_id: string,
    @Res() res: Response
  ) {
    try {
      await this.paymentService.verifyAndFinalize('Khalti', { pidx, purchase_order_id }, false);
      return res.redirect(`${this.configService.get('CORS_ORIGIN')}/payment-success`);
    } catch (error) {
        this.logger.error(`Khalti callback error: ${error.message}`);
        return res.redirect(`${this.configService.get('CORS_ORIGIN')}/payment-failure?error=${encodeURIComponent(error.message)}`);
    }
  }

  /**
   * Khalti Webhook Handler (POST)
   */
  @Post('khalti/webhook')
  @ApiOperation({ summary: 'Khalti server-to-server webhook' })
  async khaltiWebhook(@Body() body: any) {
    // Khalti webhook payload contains pidx, status, amount etc.
    await this.paymentService.verifyAndFinalize('Khalti', body, true);
    return { status: 'success' };
  }
}
