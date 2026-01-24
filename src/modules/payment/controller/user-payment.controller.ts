import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaymentService } from '../payment.service';
import { IdDto } from 'src/dto';

@Controller('payment')
export class UserPaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('vnpay/create')
  createPayment(@Body() data: IdDto) {
    return this.paymentService.createVnpayPayment(data);
  }

  @Get('vnpay/ipn')
  handleIPN(@Query() query) {
    return this.paymentService.handleVnpayIPN(query);
  }

  @Get('vnpay/return')
  handleReturn(@Query() query) {
    return this.paymentService.handleVnpayReturn(query);
  }
}
