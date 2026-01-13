import { Injectable } from '@nestjs/common';
import { UploadFileEntity } from 'src/entities';
import { UploadFileRepository } from 'src/repositories/base.repository';
import { v4 as uuidv4 } from 'uuid';
import { DeleteKeyFile, FileArchivalCreateDto } from './dto';

@Injectable()
export class FileArchivalService {
  constructor(private repo: UploadFileRepository) {}

  async create(dto: FileArchivalCreateDto): Promise<void> {
    const fileArchival = new UploadFileEntity();
    fileArchival.id = uuidv4();
    fileArchival.fileUrl = dto.fileUrl;
    fileArchival.fileName = dto.fileName;
    fileArchival[dto.fileRelationName] = dto.fileRelationId;
    fileArchival.createdAt = dto.createdAt
      ? new Date(dto.createdAt)
      : new Date();
    fileArchival.createdBy = dto.createdBy;
    fileArchival.fileType = dto.fileType;
    await this.repo.insert(fileArchival);
  }

  async save(dto: FileArchivalCreateDto): Promise<UploadFileEntity> {
    const fileArchival = new UploadFileEntity();
    fileArchival.id = uuidv4();
    fileArchival.fileUrl = dto.fileUrl;
    fileArchival.fileName = dto.fileName;
    fileArchival[dto.fileRelationName] = dto.fileRelationId;
    fileArchival.createdAt = dto.createdAt
      ? new Date(dto.createdAt)
      : new Date();
    fileArchival.createdBy = dto.createdBy;
    fileArchival.fileType = dto.fileType;
    return await this.repo.save(fileArchival);
  }

  async createMany(files: FileArchivalCreateDto[]): Promise<void> {
    const fileInserts: any[] = [];
    for (const file of files) {
      const fileArchival = new UploadFileEntity();
      fileArchival.id = uuidv4();
      fileArchival.fileUrl = file.fileUrl;
      fileArchival.fileName = file.fileName;
      fileArchival[file.fileRelationName] = file.fileRelationId;
      fileArchival.createdAt = file.createdAt
        ? new Date(file.createdAt)
        : new Date();
      fileArchival.createdBy = file.createdBy;
      fileArchival.fileType = file.fileType;
      fileInserts.push(fileArchival);
    }
    await this.repo.insert(fileInserts);
  }

  async delete(key: DeleteKeyFile, id: string) {
    await this.repo.delete({ [key]: id });
  }
}
