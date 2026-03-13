import {
  Controller,
  Post,
  Param,
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
import { UploadProductImageCommand } from '@contexts/inventory/application/commands/upload-product-image/upload-product-image.command';
import { FileValidationPipe } from '@shared/storage/pipes/file-validation.pipe';
import { Permissions } from '@shared/authorization/permissions';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_10MB = 10 * 1024 * 1024;

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class UploadProductImageController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':productId/images')
  @RequirePermissions(Permissions.PRODUCTS.UPDATE)
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
  @ApiOperation({ summary: 'Upload a product image (max 5 per product)' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 422, description: 'Max images reached' })
  async run(
    @Param('productId') productId: string,
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
      new UploadProductImageCommand(productId, file, user.id),
    );
  }
}
