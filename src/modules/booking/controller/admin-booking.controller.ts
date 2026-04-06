import { BookingRepository } from 'src/repositories';
import { BookingService } from '../booking.service';
import { Body, Controller, Post } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UpdateBookingDto } from '../dto';
import { CurrentUser } from 'src/common/decorators';
import { UserDto } from 'src/dto';

@Controller('bookings')
export class AdminBookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Post('/pagination')
  async pagination(@Body() dto: PaginationDto) {
    return this.bookingService.pagination(dto);
  }

  @Post('/update')
  async update(@Body() dto: UpdateBookingDto, @CurrentUser() user: UserDto) {
    return this.bookingService.update(dto, user);
  }
}
