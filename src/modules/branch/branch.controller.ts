import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { BranchService } from './branch.service';
import { CreateBranchDto, UpdateBranchDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Branch')
@Controller('branch')
export class BranchController {
  constructor(private readonly service: BranchService) {}

  @ApiOperation({ summary: 'Hàm phân trang' })
  @Post('pagination')
  async pagination(@CurrentUser() user: UserDto, @Body() data: PaginationDto) {
    return this.service.pagination(user, data);
  }

  @ApiOperation({ summary: 'Tạo mới' })
  @Post('create')
  async create(@CurrentUser() user: UserDto, @Body() data: CreateBranchDto) {
    return await this.service.create(user, data);
  }
  @ApiOperation({ summary: 'Cập nhật' })
  @Post('update')
  async update(@CurrentUser() user: UserDto, @Body() data: UpdateBranchDto) {
    return await this.service.update(user, data);
  }

  @ApiOperation({ summary: 'Hàm tìm kiếm chi tiết chi nhánh' })
  @Post('find-by-id')
  public async findById(@Body() data: IdDto) {
    return await this.service.findById(data.id);
  }

  @ApiOperation({ summary: 'Hàm tìm kiếm chi tiết chi nhánh' })
  @Post('find-by-code')
  public async findByCode(@Body() codes: string[]) {
    return await this.service.findByCodes(codes);
  }

  @ApiOperation({ summary: 'Hàm kích hoạt chi nhánh' })
  @UseGuards(JwtAuthGuard)
  @Post('activate')
  public async activate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.activate(user, data.id);
  }

  @ApiOperation({ summary: 'Hàm ngưng hoạt động chi nhánh' })
  @UseGuards(JwtAuthGuard)
  @Post('deactivate')
  public async deactivate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.deactivate(user, data.id);
  }

  @ApiOperation({ summary: 'Hàm tìm kiếm tất cả chi nhánh' })
  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }
}
