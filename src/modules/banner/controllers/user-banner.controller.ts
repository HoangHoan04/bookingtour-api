import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BannerService } from '../banner.service';

@Controller('banner')
@ApiTags('User - Banner')
export class UserBannerController {
  constructor(private readonly service: BannerService) {}
}
