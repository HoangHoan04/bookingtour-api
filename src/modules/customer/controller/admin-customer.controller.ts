import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { CustomerService } from '../customer.service';
import { ChangePasswordCustomerDto, CreateCustomerDto } from '../dto';
import { FilterCustomerDto } from '../dto/filterCustomer.dto';
import { UpdateCustomerDto } from '../dto/updateCustomer.dto';

@ApiTags('Admin - Customer')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('customer')
export class AdminCustomerController {
  constructor(private readonly service: CustomerService) {}

  @ApiOperation({ summary: 'Tạo mới khách hàng' })
  @Post('create')
  async create(@Body() data: CreateCustomerDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách khách hàng với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterCustomerDto>) {
    return await this.service.pagination(body);
  }

  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @ApiOperation({ summary: 'Cập nhật thông tin khách hàng' })
  @Post('update')
  async update(@Body() data: UpdateCustomerDto, @CurrentUser() user: UserDto) {
    return await this.service.update(user, data);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu khách hàng' })
  async changePassword(
    @Body() body: IdDto,
    @Body() changePasswordDto: ChangePasswordCustomerDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.changePassword(user, body.id, changePasswordDto);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động khách hàng' })
  @Post('deactivate')
  async deactivate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, body.id);
  }

  @ApiOperation({ summary: 'Kích hoạt khách hàng' })
  @Post('activate')
  async activate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, body.id);
  }

  @ApiOperation({ summary: 'Chi tiết khách hàng' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body.id);
  }
}
