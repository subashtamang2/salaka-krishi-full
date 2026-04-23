import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { EsewaService } from './esewa/esewa.service';
import { KhaltiService } from './khalti/khalti.service';
@Module({
  controllers: [],
  providers: [PaymentService, EsewaService, KhaltiService],
  exports: [PaymentService],
})
export class PaymentModule {}
