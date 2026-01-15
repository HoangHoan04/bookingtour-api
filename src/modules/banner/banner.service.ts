import { Injectable } from '@nestjs/common';
import { BannerRepository } from 'src/repositories/blog.repository';
import { ActionLogService } from '../actionLog/actionLog.service';
import { FileArchivalService } from '../fileArchival/fileArchival.service';

@Injectable()
export class BannerService {
  constructor(
    private readonly repo: BannerRepository,
    private readonly actionLogService: ActionLogService,
    private readonly fileArchivalService: FileArchivalService,
  ) {}

  async pagination() {}

  async findOne() {}

  async getTotalCount() {}
}
