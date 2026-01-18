import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { CreateFaqDto, FilterFaqDto, UpdateFaqDto } from '../dto';
import { FaqService } from '../faq.service';

@ApiBearerAuth()
@ApiTags('Admin - FAQ')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('faq')
export class AdminFaqController {
  constructor(private readonly service: FaqService) {}

  @ApiOperation({ summary: 'Tạo mới FAQ' })
  @Post('create')
  async create(@Body() data: CreateFaqDto, @CurrentUser() user: UserDto) {
    return await this.service.create(data, user);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách FAQ với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterFaqDto>) {
    return await this.service.pagination(body);
  }

  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @ApiOperation({ summary: 'Cập nhật thông tin FAQ' })
  @Post('update')
  async update(@Body() data: UpdateFaqDto, @CurrentUser() user: UserDto) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động FAQ' })
  @Post('deactivate')
  async deactivate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, body.id);
  }

  @ApiOperation({ summary: 'Kích hoạt FAQ' })
  @Post('activate')
  async activate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, body.id);
  }

  @ApiOperation({ summary: 'Chi tiết FAQ' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body.id);
  }
}
