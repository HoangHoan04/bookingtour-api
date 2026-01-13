import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import { customAlphabet } from 'nanoid';
import { Readable } from 'stream';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

@Injectable()
export class UploadFileService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  private generateFileId(): string {
    const current = new Date();
    return `${current.getFullYear()}${current.getMonth() + 1}${current.getDate()}-${nanoid()}`;
  }

  private async uploadStreamToCloudinary(
    buffer: Buffer,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            return reject(
              new Error(error.message || 'Cloudinary upload failed'),
            );
          }
          if (!result) {
            return reject(
              new Error('Cloudinary upload returned undefined result'),
            );
          }
          resolve(result);
        },
      );

      const stream = Readable.from(buffer);

      stream.on('error', (error) => {
        reject(new Error(error.message));
      });

      upload.on('error', (error) => {
        reject(new Error(error.message));
      });

      stream.pipe(upload);
    });
  }

  private async uploadBase64ToCloudinary(
    buffer: Buffer,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    return cloudinary.uploader.upload(base64, options);
  }

  async uploadSingle(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is undefined inside Service');
    }

    const folderName =
      this.configService.get<string>('LINK_UPLOAD') || 'general';
    const fileId = this.generateFileId();

    const options: UploadApiOptions = {
      folder: folderName,
      public_id: fileId,
      resource_type: 'auto',
    };

    try {
      const result = await this.uploadBase64ToCloudinary(file.buffer, options);
      return {
        fileName: `${fileId}.${result.format}`,
        fileUrl: result.secure_url,
      };
    } catch (err) {
      throw new InternalServerErrorException(
        `Upload failed: ${err instanceof Error ? err.message : err}`,
      );
    }
  }

  async uploadFile(files: Array<Express.Multer.File>) {
    const lstTask = files.map((file) => this.uploadSingle(file));
    return Promise.all(lstTask);
  }

  async uploadSinglePDF(data: Buffer) {
    const folderName =
      this.configService.get<string>('LINK_UPLOAD') || 'documents';
    const fileId = this.generateFileId();

    const options: UploadApiOptions = {
      folder: folderName,
      public_id: fileId,
      resource_type: 'raw',
      format: 'pdf',
    };

    try {
      const result = await this.uploadStreamToCloudinary(data, options);
      return {
        fileName: `${fileId}.pdf`,
        fileUrl: result.secure_url,
      };
    } catch (err) {
      throw new InternalServerErrorException(
        `Upload PDF failed: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}
