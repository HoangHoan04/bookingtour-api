import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @ApiOperation({ summary: 'Phân trang danh sách phòng ban' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Tạo mới phòng ban' })
  @Post('create')
  async create(
    @CurrentUser() user: UserDto,
    @Body() data: CreateDepartmentDto,
  ) {
    return await this.service.create(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật phòng ban' })
  @Post('update')
  async update(
    @CurrentUser() user: UserDto,
    @Body() data: UpdateDepartmentDto,
  ) {
    return await this.service.update(user, data);
  }

  @ApiOperation({ summary: 'Tìm kiếm chi tiết phòng ban theo ID' })
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data.id);
  }

  @ApiOperation({ summary: 'Kích hoạt phòng ban' })
  @Post('activate')
  async activate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.activate(user, data.id);
  }

  @ApiOperation({ summary: 'Ngừng hoạt động phòng ban' })
  @Post('deactivate')
  async deactivate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.deactivate(user, data.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách phòng ban cho select box' })
  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @ApiOperation({ summary: 'Lấy cây phòng ban (Tree structure)' })
  @Get('tree')
  async getTree() {
    return await this.service.getTree();
  }

  @ApiOperation({ summary: 'Lấy danh sách phòng ban gốc (Root departments)' })
  @Get('roots')
  async getRoots() {
    return await this.service.getRoots();
  }

  @ApiOperation({ summary: 'Lấy tất cả phòng ban con (Descendants)' })
  @Post('descendants')
  async getDescendants(@Body() data: IdDto) {
    return await this.service.getDescendants(data.id);
  }

  @ApiOperation({ summary: 'Lấy tất cả phòng ban cha (Ancestors)' })
  @Post('ancestors')
  async getAncestors(@Body() data: IdDto) {
    return await this.service.getAncestors(data.id);
  }
}
