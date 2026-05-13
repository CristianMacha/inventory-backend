import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { GetOrganizationsQuery } from '@contexts/organizations/application/queries/get-organizations/get-organizations.query';
import { OrganizationDto } from '@contexts/organizations/application/dtos/organization.dto';

@ApiBearerAuth()
@ApiTags('Organizations')
@Controller('organizations')
export class GetOrganizationsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.ORGANIZATIONS.READ)
  @ApiOperation({
    summary: 'List all organizations',
    description:
      'Returns all organizations with their storage usage and quota information.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of organizations.',
    type: [OrganizationDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires organizations.read permission.',
  })
  async run(): Promise<OrganizationDto[]> {
    return this.queryBus.execute(new GetOrganizationsQuery());
  }
}
