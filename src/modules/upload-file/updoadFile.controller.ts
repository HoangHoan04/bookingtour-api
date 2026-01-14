import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/guards';
import { UploadFileService } from './uploadFile.service';

@ApiBearerAuth()
@ApiTags('UploadFile')
@UseGuards(JwtAuthGuard)
@Controller('uploadFiles')
export class UploadFileController {
  constructor(private readonly service: UploadFileService) {}

  @ApiOperation({ summary: 'Upload single file Cloudinary' })
  @Post('upload-single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return await this.service.uploadSingle(file);
  }

  @ApiOperation({ summary: 'Upload multi file Cloudinary' })
  @Post('upload-multi')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Danh sách file trống!');
    }
    return await this.service.uploadFile(files);
  }
}
