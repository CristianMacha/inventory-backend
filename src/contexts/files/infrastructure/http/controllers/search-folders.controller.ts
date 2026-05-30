import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { OrgAccessGuard } from '@contexts/files/infrastructure/guards/org-access.guard';
import { SearchFoldersQuery } from '@contexts/files/application/queries/search-folders/search-folders.query';
import { FolderDto } from '@contexts/files/application/dtos/folder.dto';

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files/folders')
export class SearchFoldersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('search')
  @RequirePermissions(Permissions.FILES.SEARCH)
  @ApiOperation({
    summary: 'Search folders by name',
    description:
      'Returns all folders whose name contains the search term (case-insensitive).',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID',
  })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Name fragment to search',
  })
  @ApiResponse({
    status: 200,
    description: 'Matching folders.',
    type: [FolderDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Requires files.search permission. Also returns 403 if the organizationId does not belong to the authenticated user.',
  })
  async run(
    @Query('organizationId') organizationId: string,
    @Query('name') name: string,
  ): Promise<FolderDto[]> {
    if (!name || name.trim().length === 0) {
      return [];
    }
    return this.queryBus.execute(new SearchFoldersQuery(organizationId, name));
  }
}
