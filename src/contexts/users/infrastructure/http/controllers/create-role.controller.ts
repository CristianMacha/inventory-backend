import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CreateRoleDto } from '../dtos/create-role.dto';
import { CreateRoleCommand } from '../../../application/commands/create-role/create-role.command';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateRoleController {
  constructor(private readonly commandBus: CommandBus) { }

  @Post()
  @RequirePermissions(Permissions.ROLES.CREATE)
  @ApiOperation({ summary: 'Create a new role with permissions' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or invalid permission IDs',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Valid JWT token required.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User lacks required permissions.' })
  @ApiResponse({ status: 409, description: 'Role name already exists' })
  async run(@Body() createRoleDto: CreateRoleDto) {
    await this.commandBus.execute(
      new CreateRoleCommand(
        createRoleDto.name,
        createRoleDto.permissions || [],
      ),
    );
  }
}
