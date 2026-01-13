import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from './dto/createPermission.dto';
import { PermissionService } from './permission.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @ApiOperation({ summary: 'Hàm phân trang' })
  @Post('pagination')
  async pagination(@CurrentUser() user: UserDto, @Body() data: PaginationDto) {
    return this.service.pagination(user, data);
  }

  @ApiOperation({ summary: 'Lấy danh sách quyền (nhóm theo Module)' })
  @Post('find-all-grouped')
  async findAllGrouped() {
    return await this.service.findAllGrouped();
  }

  @ApiOperation({ summary: 'Tạo quyền mới' })
  @Post('create')
  async create(
    @CurrentUser() user: UserDto,
    @Body() data: CreatePermissionDto,
  ) {
    return await this.service.create(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật quyền' })
  @Post('update')
  async update(
    @CurrentUser() user: UserDto,
    @Body() data: UpdatePermissionDto,
  ) {
    return await this.service.update(user, data);
  }

  @ApiOperation({ summary: 'Xóa quyền' })
  @Post('delete')
  async delete(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.delete(user, data.id);
  }

  @ApiOperation({ summary: 'Hàm tìm kiếm chi tiết quyền' })
  @Post('find-by-id')
  public async findById(@Body() data: IdDto) {
    return await this.service.findById(data.id);
  }
}
