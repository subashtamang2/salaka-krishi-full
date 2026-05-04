import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { EsewaService } from './esewa.service';
import { KhaltiService } from './khalti.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    forwardRef(() => OrderModule),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, EsewaService, KhaltiService],
  exports: [PaymentService, EsewaService, KhaltiService],
})
export class PaymentModule {}
