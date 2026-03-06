import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { DeleteProductImageCommand } from '@contexts/inventory/application/commands/delete-product-image/delete-product-image.command';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class DeleteProductImageController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(':productId/images/:imageId')
  @HttpCode(204)
  @RequirePermissions(Permissions.PRODUCTS.UPDATE)
  @ApiOperation({ summary: 'Delete a product image' })
  @ApiResponse({ status: 204, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async run(@Param('imageId') imageId: string, @GetUser() user: AuthUserDto) {
    await this.commandBus.execute(
      new DeleteProductImageCommand(imageId, user.id),
    );
  }
}
