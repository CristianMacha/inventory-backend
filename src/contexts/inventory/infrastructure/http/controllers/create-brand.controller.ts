import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { CreateBrandDto } from '../dtos/create-brand.dto';
import { CreateBrandCommand } from '../../../application/commands/create-brand/create-brand.command';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';

@ApiBearerAuth()
@ApiTags('Brands')
@Controller('brands')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateBrandController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @RequirePermissions(Permissions.BRANDS.CREATE)
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'Brand created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or invalid permission IDs',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User lacks required permissions.',
  })
  @ApiResponse({ status: 409, description: 'Brand name already exists' })
  async run(
    @Body() createBrandDto: CreateBrandDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new CreateBrandCommand(
        createBrandDto.name,
        user.id,
        createBrandDto.description,
      ),
    );
  }
}
