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
import { GetRootFoldersQuery } from '@contexts/files/application/queries/get-root-folders/get-root-folders.query';
import { FolderDto } from '@contexts/files/application/dtos/folder.dto';

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files/folders')
export class GetRootFoldersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.FILES.READ)
  @ApiOperation({
    summary: 'List root folders of an organization',
    description:
      'Returns all top-level folders (parentId = null) for the given organization, sorted by name. Use GET /files/folders/{folderId}/contents to navigate into a folder.',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of root folders.',
    type: [FolderDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Requires files.read permission. Also returns 403 if the organizationId does not belong to the authenticated user.',
  })
  async run(
    @Query('organizationId') organizationId: string,
  ): Promise<FolderDto[]> {
    return this.queryBus.execute(new GetRootFoldersQuery(organizationId));
  }
}
