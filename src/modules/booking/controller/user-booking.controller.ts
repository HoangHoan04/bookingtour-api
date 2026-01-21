import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { BookingService } from '../booking.service';
import { CurrentUser } from 'src/common/decorators';
import { UserDto } from 'src/dto/user.dto';
import { CreateBookingDto } from '../dto';
import { BookingRepository } from 'src/repositories';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('bookings')
export class UserBookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createBooking(
    @Body() dto: CreateBookingDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.bookingService.create(dto, user);
  }
}
