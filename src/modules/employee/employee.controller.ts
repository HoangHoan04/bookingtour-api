import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from '../../dto';
import {
  CreateEmployeeCertificateDto,
  CreateEmployeeDto,
  CreateEmployeeEducationDto,
  UpdateEmployeeCertificateDto,
  UpdateEmployeeDto,
  UpdateEmployeeEducationDto,
} from './dto';
import { EmployeeService } from './employee.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @ApiOperation({ summary: 'Hàm phân trang nhân viên' })
  @Post('pagination')
  async paginationEmployee(
    @CurrentUser() user: UserDto,
    @Body() data: PaginationDto,
  ) {
    return this.service.paginationEmployee(user, data);
  }

  @ApiOperation({ summary: 'Tạo mới nhân viên' })
  @Post('create')
  async createEmployee(
    @CurrentUser() user: UserDto,
    @Body() data: CreateEmployeeDto,
  ) {
    return await this.service.createEmployee(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật nhân viên' })
  @Post('update')
  async updateEmployee(
    @CurrentUser() user: UserDto,
    @Body() data: UpdateEmployeeDto,
  ) {
    return await this.service.updateEmployee(user, data);
  }

  @ApiOperation({ summary: 'Tìm kiếm chi tiết nhân viên theo ID' })
  @Post('find-by-id')
  async findEmployeeById(@Body() data: IdDto) {
    return await this.service.findEmployeeById(data.id);
  }

  @ApiOperation({ summary: 'Kích hoạt nhân viên' })
  @Post('activate')
  async activateEmployee(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.activateEmployee(user, data.id);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động nhân viên' })
  @Post('deactivate')
  async deactivateEmployee(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.deactivateEmployee(user, data.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách nhân viên cho select box' })
  @Post('select-box')
  async selectBoxEmployee() {
    return await this.service.selectBoxEmployee();
  }

  @ApiOperation({ summary: 'Đổi mật khẩu nhân viên' })
  @Post('change-password')
  async changeEmployeePassword(
    @CurrentUser() user: UserDto,
    @Body() data: { employeeId: string; newPassword: string },
  ) {
    return await this.service.changeEmployeePassword(user, data);
  }

  @ApiOperation({ summary: 'Tìm nhân viên theo danh sách mã' })
  @Post('find-by-codes')
  async findEmployeesByCodes(@Body() data: { codes: string[] }) {
    return await this.service.findEmployeesByCodes(data.codes);
  }

  @ApiOperation({ summary: 'Phân trang thông tin học vấn' })
  @Post('education/pagination')
  async paginationEmployeeEducation(
    @CurrentUser() user: UserDto,
    @Body() data: PaginationDto,
  ) {
    return this.service.paginationEmployeeEducation(user, data);
  }

  @ApiOperation({ summary: 'Tìm thông tin học vấn theo ID' })
  @Post('education/find-by-id')
  async findEmployeeEducationById(@Body() data: IdDto) {
    return await this.service.findEmployeeEducationById(data.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách học vấn theo ID nhân viên' })
  @Post('education/find-by-employee-id')
  async findEmployeeEducationsByEmployeeId(
    @Body() data: { employeeId: string },
  ) {
    return await this.service.findEmployeeEducationsByEmployeeId(
      data.employeeId,
    );
  }

  @ApiOperation({ summary: 'Tạo mới thông tin học vấn' })
  @Post('education/create')
  async createEmployeeEducation(
    @CurrentUser() user: UserDto,
    @Body() data: CreateEmployeeEducationDto,
  ) {
    return await this.service.createEmployeeEducation(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin học vấn' })
  @Post('education/update')
  async updateEmployeeEducation(
    @CurrentUser() user: UserDto,
    @Body() data: UpdateEmployeeEducationDto,
  ) {
    return await this.service.updateEmployeeEducation(user, data);
  }

  @ApiOperation({ summary: 'Xóa thông tin học vấn' })
  @Post('education/delete')
  async deleteEmployeeEducation(
    @CurrentUser() user: UserDto,
    @Body() data: IdDto,
  ) {
    return await this.service.deleteEmployeeEducation(user, data.id);
  }

  @ApiOperation({ summary: 'Phân trang chứng chỉ' })
  @Post('certificate/pagination')
  async paginationEmployeeCertificate(
    @CurrentUser() user: UserDto,
    @Body() data: PaginationDto,
  ) {
    return this.service.paginationEmployeeCertificate(user, data);
  }

  @ApiOperation({ summary: 'Tìm chứng chỉ theo ID' })
  @Post('certificate/find-by-id')
  async findEmployeeCertificateById(@Body() data: IdDto) {
    return await this.service.findEmployeeCertificateById(data.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách chứng chỉ theo ID nhân viên' })
  @Post('certificate/find-by-employee-id')
  async findEmployeeCertificatesByEmployeeId(
    @Body() data: { employeeId: string },
  ) {
    return await this.service.findEmployeeCertificatesByEmployeeId(
      data.employeeId,
    );
  }

  @ApiOperation({ summary: 'Tạo mới chứng chỉ' })
  @Post('certificate/create')
  async createEmployeeCertificate(
    @CurrentUser() user: UserDto,
    @Body() data: CreateEmployeeCertificateDto,
  ) {
    return await this.service.createEmployeeCertificate(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật chứng chỉ' })
  @Post('certificate/update')
  async updateEmployeeCertificate(
    @CurrentUser() user: UserDto,
    @Body() data: UpdateEmployeeCertificateDto,
  ) {
    return await this.service.updateEmployeeCertificate(user, data);
  }

  @ApiOperation({ summary: 'Xóa chứng chỉ' })
  @Post('certificate/delete')
  async deleteEmployeeCertificate(
    @CurrentUser() user: UserDto,
    @Body() data: IdDto,
  ) {
    return await this.service.deleteEmployeeCertificate(user, data.id);
  }
}
