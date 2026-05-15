import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { GetFolderQuery } from '@contexts/files/application/queries/get-folder/get-folder.query';
import { FolderDto } from '@contexts/files/application/dtos/folder.dto';

@ApiBearerAuth()
@ApiTags('Files')
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
    description: 'Forbidden. Requires files.read permission.',
  })
  @ApiResponse({ status: 404, description: 'Folder not found.' })
  async run(
    @Param('folderId') folderId: string,
    @Query('organizationId') organizationId: string,
  ): Promise<FolderDto> {
    return this.queryBus.execute(new GetFolderQuery(folderId, organizationId));
  }
}
