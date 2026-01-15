import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { CreateTranslationDto, UpdateTranslationDto } from '../dto';
import { TranslationsService } from '../translations.service';

@ApiBearerAuth()
@ApiTags('Admin - Customer')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('translations')
export class AdminTranslationsController {
  constructor(private readonly service: TranslationsService) {}

  @ApiOperation({ summary: 'Hàm phân trang' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Tạo mới' })
  @Post('create')
  async create(
    @CurrentUser() user: UserDto,
    @Body() data: CreateTranslationDto,
  ) {
    return await this.service.create(user, data);
  }
  @ApiOperation({ summary: 'Cập nhật' })
  @Post('update')
  async update(
    @CurrentUser() user: UserDto,
    @Body() data: UpdateTranslationDto,
  ) {
    return await this.service.update(user, data);
  }

  @ApiOperation({ summary: 'Hàm tìm kiếm chi tiết bản dịch' })
  @Post('find-by-key')
  public async findByKey(@Body() key: string) {
    return await this.service.findByKey(key);
  }

  @ApiOperation({ summary: 'Hàm xóa bản dịch' })
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  public async delete(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.delete(user, data.id);
  }
}
