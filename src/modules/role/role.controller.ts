import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from '../../dto';
import { AssignPermissionDto, CreateRoleDto, UpdateRoleDto } from './dto';
import { RoleService } from './role.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @ApiOperation({ summary: 'Lấy danh sách tất cả vai trò' })
  @Post('find-all')
  async findAll() {
    return await this.service.findAll();
  }

  @ApiOperation({ summary: 'Hàm phân trang' })
  @Post('pagination')
  async pagination(@CurrentUser() user: UserDto, @Body() data: PaginationDto) {
    return this.service.pagination(user, data);
  }

  @ApiOperation({
    summary: 'Lấy chi tiết vai trò (kèm danh sách quyền hiện tại)',
  })
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findOne(data.id);
  }

  @ApiOperation({ summary: 'Tạo vai trò mới (Chỉ thông tin cơ bản)' })
  @Post('create')
  async create(@CurrentUser() user: UserDto, @Body() data: CreateRoleDto) {
    return await this.service.create(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin vai trò (Tên, mã, mô tả)' })
  @Post('update')
  async update(@CurrentUser() user: UserDto, @Body() data: UpdateRoleDto) {
    return await this.service.update(user, data);
  }

  @ApiOperation({ summary: 'Phân quyền cho vai trò (Gán danh sách quyền mới)' })
  @Post('assign-permissions')
  async assignPermissions(
    @CurrentUser() user: UserDto,
    @Body() data: AssignPermissionDto,
  ) {
    return await this.service.assignPermissions(user, data);
  }

  @ApiOperation({ summary: 'Xóa vai trò' })
  @Post('delete')
  async delete(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.delete(user, data.id);
  }

  @ApiOperation({ summary: 'Hàm tìm kiếm tất cả vai trò (Select box)' })
  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @Post('users-by-role')
  async findEmployeesByRoleId(@Body() body: { roleId: string }) {
    return await this.service.findEmployeesByRoleId(body.roleId);
  }
}
