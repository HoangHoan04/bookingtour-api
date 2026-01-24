import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import {
  ChangePasswordTourGuideDto,
  CreateTourGuideDto,
  FilterTourGuideDto,
  UpdateTourGuideDto,
} from '../dto';
import { TourGuideService } from '../tour-guide.service';

@ApiTags('Admin - TourGuide')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('tour-guide')
export class AdminTourGuideController {
  constructor(private readonly service: TourGuideService) {}

  @ApiOperation({ summary: 'Tạo mới hướng dẫn viên' })
  @Post('create')
  async create(@Body() data: CreateTourGuideDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách hướng dẫn viên với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterTourGuideDto>) {
    return await this.service.pagination(body);
  }

  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @ApiOperation({ summary: 'Cập nhật thông tin hướng dẫn viên' })
  @Post('update')
  async update(@Body() data: UpdateTourGuideDto, @CurrentUser() user: UserDto) {
    return await this.service.update(user, data);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu hướng dẫn viên' })
  async changePassword(
    @Body() body: IdDto,
    @Body() changePasswordDto: ChangePasswordTourGuideDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.changePassword(user, body.id, changePasswordDto);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động hướng dẫn viên' })
  @Post('deactivate')
  async deactivate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, body.id);
  }

  @ApiOperation({ summary: 'Kích hoạt hướng dẫn viên' })
  @Post('activate')
  async activate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, body.id);
  }

  @ApiOperation({ summary: 'Chi tiết hướng dẫn viên' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body.id);
  }
}
