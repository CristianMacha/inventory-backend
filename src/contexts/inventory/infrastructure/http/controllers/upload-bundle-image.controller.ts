import {
  Controller,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { UploadBundleImageCommand } from '@contexts/inventory/application/commands/upload-bundle-image/upload-bundle-image.command';
import { FileValidationPipe } from '@shared/storage/pipes/file-validation.pipe';
import { Permissions } from '@shared/authorization/permissions';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_10MB = 10 * 1024 * 1024;

@ApiBearerAuth()
@ApiTags('Bundles')
@Controller('bundles')
export class UploadBundleImageController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':bundleId/image')
  @HttpCode(200)
  @RequirePermissions(Permissions.BUNDLES.UPDATE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, WebP — max 10MB)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload or replace the bundle image' })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 404, description: 'Bundle not found' })
  async run(
    @Param('bundleId') bundleId: string,
    @UploadedFile(
      new FileValidationPipe({
        allowedMimeTypes: IMAGE_MIME_TYPES,
        maxSizeBytes: MAX_10MB,
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new UploadBundleImageCommand(bundleId, file, user.id),
    );
  }
}
