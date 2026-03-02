import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { CreateProductCommand } from '@contexts/inventory/application/commands/create-product/create-product.command';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateProductDto } from '../dtos/create-product.dto';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products')
export class CreateProductController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @RequirePermissions(Permissions.PRODUCTS.CREATE)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or name already exists',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async run(@Body() dto: CreateProductDto, @GetUser() user: AuthUserDto) {
    await this.commandBus.execute(
      new CreateProductCommand(
        dto.name,
        user.id,
        dto.categoryId,
        dto.levelId,
        dto.finishId,
        dto.description,
        dto.brandId,
      ),
    );
  }
}
