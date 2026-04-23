import { Controller, Post, Get, Body, Param, UseGuards, Req, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CheckoutService } from './checkout.service';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly checkoutService: CheckoutService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  async cancel(
    @Req() req: any, 
    @Param('id') id: string, 
    @Body('reason') reason: string,
    @Body('note') note?: string
  ) {
    return this.orderService.cancelOrder(req.user.sub, id, reason, note);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/cancellation')
  @ApiOperation({ summary: 'Get order cancellation details' })
  async getCancellation(@Param('id') id: string) {
    return this.orderService.getOrderCancellations(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('cancellations')
  @ApiOperation({ summary: 'Get all order cancellations' })
  async getAllCancellations() {
    return this.orderService.getAllCancellations();
  }

  @Get('verify-esewa')
  @ApiOperation({ summary: 'Verify eSewa payment' })
  async verifyEsewa(@Req() req: any) {
    const { data } = req.query;
    return this.checkoutService.verifyAndFinalize('eSewa', { data });
  }

  @Get('verify-khalti')
  @ApiOperation({ summary: 'Verify Khalti payment' })
  async verifyKhalti(@Req() req: any) {
    const { pidx } = req.query;
    return this.checkoutService.verifyAndFinalize('Khalti', { pidx });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new order from cart' })
  async create(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    return this.checkoutService.initiateCheckout(req.user.sub, createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async getOrders(@Req() req: any) {
    const isAdmin = req.user.role === 'Admin' || req.user.role === 'SuperAdmin';
    const { includeArchived, search, status, payment_status, payment_method, date_from, date_to, page, limit } = req.query;
    return this.orderService.getOrders({
      userId: isAdmin ? undefined : req.user.sub,
      includeArchived: includeArchived === 'true',
      search,
      status,
      paymentStatus: payment_status,
      paymentMethod: payment_method,
      dateFrom: date_from,
      dateTo: date_to,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive an order' })
  async archive(@Param('id') id: string) {
    return this.orderService.archiveOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reopen')
  @ApiOperation({ summary: 'Reopen a cancelled or delivered order' })
  async reopen(@Req() req: any, @Param('id') id: string, @Body('resetCodPayment') resetCodPayment: boolean) {
    return this.orderService.reopenOrder(req.user.sub, id, resetCodPayment);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cash-collected')
  @ApiOperation({ summary: 'Toggle cash collected for COD orders' })
  async toggleCash(@Param('id') id: string, @Body('cashCollected') cashCollected: boolean) {
    return this.orderService.toggleCashCollected(id, cashCollected);
  }

  @Patch(':id/payment-failed')
  @ApiOperation({ summary: 'Mark payment as failed' })
  async paymentFailed(@Param('id') id: string) {
    return this.orderService.markPaymentFailed(id);
  }


  @UseGuards(JwtAuthGuard) // Add Role Guard if available
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('cashCollected') cashCollected?: boolean
  ) {
    return this.orderService.updateOrderStatus(id, status, cashCollected);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }
}
