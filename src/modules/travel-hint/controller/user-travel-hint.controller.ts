import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTravelHintDto } from '../dto/get-travel-hint-by-type.dto';
import { TravelHintService } from '../travel-hint.service';

@ApiTags('User - TravelHint')
@Controller('travel-hint')
export class UserTravelHintController {
  constructor(private readonly service: TravelHintService) {}

  @Post('get-travel-hint-by-type')
  @ApiOperation({ summary: 'Lấy danh sách địa điểm gợi ý theo loại' })
  async findByType(@Body() dto: GetTravelHintDto) {
    if (dto.type) {
      return this.service.findByType(dto.type);
    }
    return this.service.findAll();
  }
}
