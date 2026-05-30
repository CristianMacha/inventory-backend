import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { OrgAccessGuard } from '@contexts/files/infrastructure/guards/org-access.guard';
import { GetFolderQuery } from '@contexts/files/application/queries/get-folder/get-folder.query';
import { FolderDto } from '@contexts/files/application/dtos/folder.dto';

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files/folders')
export class GetFolderController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':folderId')
  @RequirePermissions(Permissions.FILES.READ)
  @ApiOperation({ summary: 'Get folder detail' })
  @ApiParam({ name: 'folderId', description: 'Folder UUID' })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID',
  })
  @ApiResponse({ status: 200, description: 'Folder detail.', type: FolderDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Requires files.read permission. Also returns 403 if the organizationId does not belong to the authenticated user.',
  })
  @ApiResponse({ status: 404, description: 'Folder not found.' })
  async run(
    @Param('folderId') folderId: string,
    @Query('organizationId') organizationId: string,
  ): Promise<FolderDto> {
    return this.queryBus.execute(new GetFolderQuery(folderId, organizationId));
  }
}
