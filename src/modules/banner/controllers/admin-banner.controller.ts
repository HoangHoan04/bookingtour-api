import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { FilterCustomerDto } from 'src/modules/customer/dto/filterCustomer.dto';
import { BannerService } from '../banner.service';
import { CreateBannerDto, UpdateBannerDto } from '../dto';

@ApiTags('Admin - Banner')
@Controller('banner')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AdminBannerController {
  constructor(private readonly service: BannerService) {}

  @ApiOperation({ summary: 'Tạo mới banner' })
  @Post('create')
  async create(@Body() data: CreateBannerDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách banner với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterCustomerDto>) {
    return await this.service.pagination(body);
  }

  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @ApiOperation({ summary: 'Cập nhật thông tin banner' })
  @Post('update')
  async update(@Body() data: UpdateBannerDto, @CurrentUser() user: UserDto) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động banner' })
  @Post('deactivate')
  async deactivate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, body.id);
  }

  @ApiOperation({ summary: 'Kích hoạt banner' })
  @Post('activate')
  async activate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, body.id);
  }

  @ApiOperation({ summary: 'Chi tiết banner' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body.id);
  }
}
