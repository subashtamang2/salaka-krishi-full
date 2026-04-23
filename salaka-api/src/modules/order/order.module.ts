import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CheckoutService } from './checkout.service';

import { CouponModule } from '../coupon/coupon.module';
import { PaymentModule } from '../payment/payment.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CouponModule, PaymentModule, CartModule],
  controllers: [OrderController],
  providers: [OrderService, CheckoutService],
})
export class OrderModule {}
