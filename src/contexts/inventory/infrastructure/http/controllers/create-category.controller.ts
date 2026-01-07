import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '@shared/authorization/permissions';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { CreateCategoryCommand } from '@contexts/inventory/application/commands/create-category/create-cateogry.command';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateCategoryController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @RequirePermissions(Permissions.CATEGORIES.CREATE)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or category name already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User lacks required permissions.',
  })
  async run(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new CreateCategoryCommand(
        createCategoryDto.name,
        user.id,
        createCategoryDto.description,
      ),
    );
  }
}
