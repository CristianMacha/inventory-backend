import { BadRequestException, PipeTransform } from '@nestjs/common';

interface FileValidationOptions {
  allowedMimeTypes: string[];
  maxSizeBytes: number;
}

export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions) {}

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const isAllowedMime = this.options.allowedMimeTypes.some((mime) => {
      if (mime.endsWith('/*')) {
        const type = mime.split('/')[0];
        return file.mimetype.startsWith(`${type}/`);
      }
      return file.mimetype === mime;
    });

    if (!isAllowedMime) {
      throw new BadRequestException(
        `File type "${file.mimetype}" is not allowed. Allowed types: ${this.options.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.options.maxSizeBytes) {
      const maxMb = (this.options.maxSizeBytes / (1024 * 1024)).toFixed(0);
      throw new BadRequestException(`File size exceeds the ${maxMb}MB limit`);
    }

    return file;
  }
}
