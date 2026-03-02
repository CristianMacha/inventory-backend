import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { UpdateProductCommand } from '@contexts/inventory/application/commands/update-product/update-product.command';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class UpdateProductController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.PRODUCTS.UPDATE)
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 404,
    description: 'Product, brand, category, level or finish not found',
  })
  @ApiResponse({ status: 409, description: 'Product name already exists' })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new UpdateProductCommand(
        id,
        user.id,
        dto.name,
        dto.description,
        dto.brandId,
        dto.categoryId,
        dto.levelId,
        dto.finishId,
        dto.isActive,
      ),
    );

    return {
      statusCode: HttpStatus.OK,
      message: `Product with id ${id} updated successfully`,
    };
  }
}
