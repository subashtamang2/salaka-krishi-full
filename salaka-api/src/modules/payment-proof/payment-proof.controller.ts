import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Req,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorators';
import { ROLE } from '@prisma/client';
import { PaymentProofService } from './payment-proof.service';
import { UploadProofDto } from './dto/upload-proof.dto';
import { VerifyProofDto } from './dto/verify-proof.dto';
import { ApproveProofDto } from './dto/approve-proof.dto';
import { RejectProofDto } from './dto/reject-proof.dto';

@ApiTags('Payment Proofs')
@ApiBearerAuth()
@Controller('payment-proof')
@UseGuards(JwtAuthGuard)
export class PaymentProofController {
  constructor(private readonly service: PaymentProofService) {}

  /**
   * USER: upload / submit payment proof screenshot
   */
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a payment proof screenshot for an order' })
  async upload(@Body() dto: UploadProofDto) {
    const result = await this.service.uploadProof(dto);
    return {
      message: 'Payment proof uploaded successfully',
      data: result,
    };
  }

  /**
   * ADMIN: list pending proofs
   */
  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @ApiOperation({ summary: 'Get all pending payment proofs' })
  async getPending() {
    const result = await this.service.getPendingProofs();
    return {
      message: 'Pending payment proofs fetched successfully',
      data: result,
    };
  }

  /**
   * ADMIN: approve payment proof
   */
  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @ApiOperation({ summary: 'Approve a payment proof' })
  async approve(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: ApproveProofDto,
  ) {
    const result = await this.service.approveProof(id, req.user.sub, dto.note);
    return {
      message: 'Payment proof approved successfully',
      data: result,
    };
  }

  /**
   * ADMIN: reject payment proof
   */
  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @ApiOperation({ summary: 'Reject a payment proof' })
  async reject(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: RejectProofDto,
  ) {
    const result = await this.service.rejectProof(id, req.user.sub, dto.note);
    return {
      message: 'Payment proof rejected successfully',
      data: result,
    };
  }

  /**
   * ADMIN: legacy verify endpoint (retained for backward compatibility)
   */
  @Patch(':paymentId/verify')
  @UseGuards(RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @ApiOperation({ summary: 'Verify payment by payment ID' })
  async verify(
    @Req() req: any,
    @Param('paymentId') paymentId: string,
    @Body() dto: VerifyProofDto,
  ) {
    const result = await this.service.verifyProof(
      paymentId,
      req.user.sub,
      dto.approved,
      dto.note,
    );
    return {
      message: 'Payment verified successfully',
      data: result,
    };
  }

  /**
   * ADMIN: list all proofs
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles(ROLE.Admin, ROLE.SuperAdmin)
  @ApiOperation({ summary: 'Get all payment proofs' })
  async getAll() {
    const result = await this.service.getAllProofs();
    return {
      message: 'Payment proofs fetched successfully',
      data: result,
    };
  }
}
