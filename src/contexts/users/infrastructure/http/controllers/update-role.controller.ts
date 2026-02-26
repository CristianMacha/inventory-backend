import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UpdateRoleDto } from '../dtos/update-role.dto';
import { UpdateRoleCommand } from '../../../application/commands/update-role/update-role.command';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateRoleController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @RequirePermissions(Permissions.ROLES.UPDATE)
  @ApiOperation({ summary: 'Update role name and/or permissions' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
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
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiParam({ name: 'id', type: String })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    await this.commandBus.execute(
      new UpdateRoleCommand(id, updateRoleDto.name, updateRoleDto.permissions),
    );
  }
}
