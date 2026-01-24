import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { DestinationService } from '../destination.service';
import {
  CreateDestinationDto,
  FilterDestinationDto,
  UpdateDestinationDto,
} from '../dto';

@ApiBearerAuth()
@ApiTags('Admin - Destination')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('destination')
export class AdminDestinationController {
  constructor(private readonly service: DestinationService) {}

  @ApiOperation({ summary: 'Tạo mới điểm đến' })
  @Post('create')
  async create(
    @Body() data: CreateDestinationDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.create(data, user);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách điểm đến với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterDestinationDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Lấy danh sách điểm đến cho select box' })
  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @ApiOperation({ summary: 'Cập nhật thông tin điểm đến' })
  @Post('update')
  async update(
    @Body() data: UpdateDestinationDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động điểm đến' })
  @Post('deactivate')
  async deactivate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, body.id);
  }

  @ApiOperation({ summary: 'Kích hoạt điểm đến' })
  @Post('activate')
  async activate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, body.id);
  }

  @ApiOperation({ summary: 'Chi tiết điểm đến' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách tour theo điểm đến' })
  @Post('get-tours-by-destination')
  async getToursByDestination(@Body() body: IdDto) {
    return await this.service.getToursByDestination(body.id);
  }
}
