import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const XLSX_MIME =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const XLSX_MAX_SIZE_BYTES = 10 * 1024 * 1024;

export type UploadedFileMeta = {
  originalname?: string;
  mimetype?: string;
  size?: number;
};

export function isXlsxFile(meta?: UploadedFileMeta): boolean {
  const nameOk = !!meta?.originalname?.toLowerCase().endsWith('.xlsx');
  const mimeOk = meta?.mimetype === XLSX_MIME;
  return nameOk || mimeOk;
}

export function assertXlsxFile(meta?: UploadedFileMeta): void {
  if (!isXlsxFile(meta)) {
    throw new BadRequestException('Chỉ hỗ trợ file .xlsx');
  }
  if (typeof meta?.size === 'number' && meta.size > XLSX_MAX_SIZE_BYTES) {
    throw new BadRequestException('Dung lượng file vượt quá 10MB');
  }
}

export function xlsxMulterOptions(): MulterOptions {
  return {
    limits: { fileSize: XLSX_MAX_SIZE_BYTES },
    fileFilter: (_req, file, cb) => {
      const ok = isXlsxFile(file);
      cb(ok ? null : new BadRequestException('Chỉ hỗ trợ file .xlsx'), ok);
    },
  };
}
