import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { CreatePartMasterDto, UpdatePartMasterDto } from './dto';
import { PartMasterService } from './part-master.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Part Master')
@Controller('part-master')
export class PartMasterController {
  constructor(private readonly service: PartMasterService) {}

  @ApiOperation({ summary: 'Hàm phân trang' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Tạo mới' })
  @Post('create')
  async create(
    @CurrentUser() user: UserDto,
    @Body() data: CreatePartMasterDto,
  ) {
    return await this.service.create(user, data);
  }
  @ApiOperation({ summary: 'Cập nhật' })
  @Post('update')
  async update(
    @CurrentUser() user: UserDto,
    @Body() data: UpdatePartMasterDto,
  ) {
    return await this.service.update(user, data);
  }

  @ApiOperation({ summary: 'Hàm tìm kiếm chi tiết bộ phận master' })
  @Post('find-by-id')
  public async findById(@Body() data: IdDto) {
    return await this.service.findById(data.id);
  }

  @ApiOperation({ summary: 'Hàm kích hoạt bộ phận master' })
  @UseGuards(JwtAuthGuard)
  @Post('activate')
  public async activate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.activate(user, data.id);
  }

  @ApiOperation({ summary: 'Hàm ngưng hoạt động bộ phận master' })
  @UseGuards(JwtAuthGuard)
  @Post('deactivate')
  public async deactivate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.deactivate(user, data.id);
  }

  @ApiOperation({ summary: 'Hàm tìm kiếm tất cả  bộ phận master' })
  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }
}
