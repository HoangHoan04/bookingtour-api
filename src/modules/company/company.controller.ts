import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { CompanyService } from './company.service';
import { CreateCompanyDto, ImportCompanyDto, UpdateCompanyDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}
  @ApiOperation({ summary: 'Hàm phân trang' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Tạo mới' })
  @Post('create')
  async create(@CurrentUser() user: UserDto, @Body() data: CreateCompanyDto) {
    return await this.service.create(user, data);
  }
  @ApiOperation({ summary: 'Cập nhật' })
  @Post('update')
  async update(@CurrentUser() user: UserDto, @Body() data: UpdateCompanyDto) {
    return await this.service.update(user, data);
  }

  @ApiOperation({ summary: 'Hàm tìm kiếm chi tiết công ty' })
  @Post('find-by-id')
  public async findById(@Body() data: IdDto) {
    return await this.service.findById(data.id);
  }

  @ApiOperation({ summary: 'Hàm kích hoạt công ty' })
  @UseGuards(JwtAuthGuard)
  @Post('activate')
  public async activate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.activate(user, data.id);
  }

  @ApiOperation({ summary: 'Hàm ngưng hoạt động công ty' })
  @UseGuards(JwtAuthGuard)
  @Post('deactivate')
  public async deactivate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.deactivate(user, data.id);
  }

  @ApiOperation({ summary: 'Hàm tìm kiếm tất cả công ty' })
  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @ApiOperation({ summary: 'Hàm lấy cây công ty (parent-child)' })
  @Post('tree')
  async getCompanyTree() {
    return await this.service.getCompanyTree();
  }

  @ApiOperation({ summary: 'Hàm nhập excel công ty từ file excel' })
  @Post('import')
  async importCompanies(
    @CurrentUser() user: UserDto,
    @Body() data: ImportCompanyDto,
  ) {
    return this.service.importCompanies(user, data);
  }
}
