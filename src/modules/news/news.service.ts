import { Injectable } from '@nestjs/common';
import { NewsRepository } from 'src/repositories/blog.repository';
import { ActionLogService } from '../actionLog/actionLog.service';
import { FileArchivalService } from '../fileArchival/fileArchival.service';
import { UploadFileService } from '../upload-file/uploadFile.service';

@Injectable()
export class NewsService {
  constructor(
    private readonly repo: NewsRepository,
    private readonly actionLogService: ActionLogService,
    private readonly fileArchivalService: FileArchivalService,
    private readonly uploadFileService: UploadFileService,
  ) {}
}
