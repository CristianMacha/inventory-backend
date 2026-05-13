import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Permissions } from '@shared/authorization/permissions';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { CreateOrganizationCommand } from '@contexts/organizations/application/commands/create-organization/create-organization.command';

@ApiBearerAuth()
@ApiTags('Organizations')
@Controller('organizations')
export class CreateOrganizationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @RequirePermissions(Permissions.ORGANIZATIONS.CREATE)
  @ApiOperation({
    summary: 'Create a new organization',
    description:
      'Creates an organization that acts as the shared storage space for files. Default quota is 10 GB.',
  })
  @ApiResponse({
    status: 201,
    description: 'Organization created. Returns the new organization ID.',
    schema: { example: { id: 'uuid' } },
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires organizations.create permission.',
  })
  async run(
    @Body() dto: CreateOrganizationDto,
    @GetUser() user: AuthUserDto,
  ): Promise<{ id: string }> {
    return this.commandBus.execute(
      new CreateOrganizationCommand(dto.name, user.id, dto.storageLimitBytes),
    );
  }
}
