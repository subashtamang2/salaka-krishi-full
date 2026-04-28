import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CheckoutService } from "./checkout.service";
import { CheckoutSummaryRequestDto, CheckoutSummaryResponseDto } from "./dto/checkout-summary.dto";

@ApiTags('checkout')
@Controller('checkout')
@UseGuards(JwtAuthGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('summary')
  @ApiOperation({ summary: 'Get checkout pricing summary' })
  @ApiResponse({ type: CheckoutSummaryResponseDto })
  async getSummary(@Req() req: any, @Body() dto: CheckoutSummaryRequestDto) {
    const summary = await this.checkoutService.getSummary(req.user.sub, dto);
    return {
      message: 'Checkout summary retrieved successfully',
      data: summary,
    };
  }
}
