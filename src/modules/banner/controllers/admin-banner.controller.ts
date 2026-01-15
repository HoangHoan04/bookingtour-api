import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { BannerService } from '../banner.service';

@ApiTags('Admin - Banner')
@Controller('banner')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AdminBannerController {
  constructor(private readonly service: BannerService) {}
}
