import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UploadProofDto {
  @ApiProperty({ example: "order-123" })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ example: "/uploads/payment-proof-abc.png" })
  @IsString()
  @IsNotEmpty()
  screenshotUrl: string;

  @ApiPropertyOptional({ example: "payment-screenshot.png" })
  @IsOptional()
  @IsString()
  screenshotName?: string;
}
