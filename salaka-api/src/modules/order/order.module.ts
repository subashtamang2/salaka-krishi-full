import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';

import { CouponModule } from '../coupon/coupon.module';
import { PaymentModule } from '../payment/payment.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    CouponModule, 
    forwardRef(() => PaymentModule), 
    CartModule
  ],
  controllers: [OrderController, CheckoutController],
  providers: [OrderService, CheckoutService],
  exports: [OrderService, CheckoutService],
})
export class OrderModule {}
