import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { StorageResult } from '@shared/domain/storage/storage-result.interface';

@Injectable()
export class CloudinaryService {
  private readonly baseFolder: string;

  constructor(private readonly configService: ConfigService) {
    this.baseFolder = this.configService.get<string>(
      'CLOUDINARY_STORAGE_BASE_FOLDER',
    )!;

    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<StorageResult> {
    const folderPath = [this.baseFolder, folder].filter(Boolean).join('/');

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: folderPath, resource_type: 'auto' },
        (error, result) => {
          if (error || !result) {
            reject(
              error instanceof Error
                ? error
                : new Error('Cloudinary upload failed'),
            );
            return;
          }
          resolve({
            publicId: result.public_id,
            url: cloudinary.url(result.public_id),
          });
        },
      );
      stream.end(file.buffer);
    });
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  buildUrl(publicId: string): string {
    return cloudinary.url(publicId);
  }
}
