import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { UpdateCategoryCommand } from '@contexts/inventory/application/commands/update-category/update-category.command';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateCategoryController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.CATEGORIES.UPDATE)
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', type: String, description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category name already exists' })
  async run(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new UpdateCategoryCommand(id, user.id, dto.name, dto.description),
    );
    return {
      statusCode: HttpStatus.OK,
      message: `Category with id ${id} updated successfully`,
    };
  }
}
