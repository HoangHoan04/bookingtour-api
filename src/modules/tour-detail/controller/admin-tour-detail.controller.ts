import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TourDetailService } from '../tour-detail.service';
import { CreateTourDetailDto } from '../dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IdDto, TourIdDto } from 'src/dto/id.dto';
import { UserDto } from 'src/dto/user.dto';
import { PaginationDto } from 'src/dto/pagination.dto';

@ApiTags('Admin - Tour Details')
@Controller('tour-detail')
@UseGuards(JwtAuthGuard)
export class AdminTourDetailController {
  constructor(private readonly tourDetailService: TourDetailService) {}

  @ApiOperation({ summary: 'Tạo chi tiết tour' })
  @Post('/create')
  create(@Body() dto: CreateTourDetailDto, @CurrentUser() user) {
    return this.tourDetailService.create(dto, user);
  }

  @ApiOperation({ summary: 'Cập nhật chi tiết tour' })
  @Post('/update')
  update(@Body() dto, @CurrentUser() user) {
    return this.tourDetailService.update(dto.id, dto, user);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Lấy chi tiết tour theo id' })
  async findById(@Body() body: IdDto) {
    return await this.tourDetailService.findById(body.id);
  }

  @ApiOperation({ summary: 'Kích hoạt chi tiết tour' })
  @Post('activate')
  async activate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.tourDetailService.activateTourDetail(user, body.id);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động chi tiết tour' })
  @Post('deactivate')
  async deactivate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.tourDetailService.deactivateTourDetail(user, body.id);
  }

  @ApiOperation({ summary: 'Thay đổi trạng thái chi tiết tour' })
  @Post('change-status')
  async changeStatus(
    @Body() body: { id: string; status: string },
    @CurrentUser() user: UserDto,
  ) {
    return await this.tourDetailService.changeStatus(
      body.id,
      body.status,
      user,
    );
  }

  @ApiOperation({ summary: 'Phân trang chi tiết tour' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.tourDetailService.pagination(data);
  }
}
