import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { GetFolderContentsQuery } from '@contexts/files/application/queries/get-folder-contents/get-folder-contents.query';
import { FolderContentsDto } from '@contexts/files/application/dtos/folder-contents.dto';

@ApiBearerAuth()
@ApiTags('Files')
@Controller('files/folders')
export class GetFolderContentsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':folderId/contents')
  @RequirePermissions(Permissions.FILES.READ)
  @ApiOperation({
    summary: 'Get folder contents',
    description:
      'Returns the folder metadata, its direct subfolders, and a paginated list of files inside it.',
  })
  @ApiParam({
    name: 'folderId',
    description: 'Folder UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID that owns the folder',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Files per page (max 100)',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Folder contents including subfolders and paginated files.',
    type: FolderContentsDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires files.read permission.',
  })
  @ApiResponse({
    status: 404,
    description: 'Folder not found or does not belong to this organization.',
  })
  async run(
    @Param('folderId', new ParseUUIDPipe()) folderId: string,
    @Query('organizationId') organizationId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<FolderContentsDto> {
    return this.queryBus.execute(
      new GetFolderContentsQuery(folderId, organizationId, page, limit),
    );
  }
}
