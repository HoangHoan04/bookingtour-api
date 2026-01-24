import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { FilterCustomerDto } from 'src/modules/customer/dto/filterCustomer.dto';
import { CreateTravelHintDto, UpdateTravelHintDto } from '../dto';
import { TravelHintService } from '../travel-hint.service';

@ApiTags('Admin - TravelHint')
@Controller('travel-hint')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AdminTravelHintController {
  constructor(private readonly service: TravelHintService) {}

  @ApiOperation({ summary: 'Tạo mới TravelHint' })
  @Post('create')
  async create(
    @Body() data: CreateTravelHintDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.create(user, data);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách địa điểm gợi ý với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterCustomerDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin địa điểm gợi ý' })
  @Post('update')
  async update(
    @Body() data: UpdateTravelHintDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động địa điểm gợi ý' })
  @Post('deactivate')
  async deactivate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, body.id);
  }

  @ApiOperation({ summary: 'Kích hoạt địa điểm gợi ý' })
  @Post('activate')
  async activate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, body.id);
  }

  @ApiOperation({ summary: 'Chi tiết địa điểm gợi ý' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body.id);
  }
}
