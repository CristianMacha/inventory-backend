import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { SearchFilesQuery } from '@contexts/files/application/queries/search-files/search-files.query';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { FileRecordDto } from '@contexts/files/application/dtos/file-record.dto';
import { PaginatedFileSearchResultDto } from '@contexts/files/application/dtos/paginated-file-search-result.dto';

@ApiBearerAuth()
@ApiTags('Files')
@Controller('files')
export class SearchFilesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('search')
  @RequirePermissions(Permissions.FILES.SEARCH)
  @ApiOperation({
    summary: 'Search files',
    description:
      'Search files across an organization by tags, name fragment, MIME type, or folder. All filters are optional and combinable. Tags are matched with OR logic (any file that has at least one of the provided tags).',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    isArray: true,
    description: 'One or more tags to match (OR logic)',
    example: ['factura', 'proveedor'],
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Partial file name match (case-insensitive)',
    example: 'contrato',
  })
  @ApiQuery({
    name: 'mimeType',
    required: false,
    description: 'MIME type prefix filter',
    example: 'application/pdf',
  })
  @ApiQuery({
    name: 'folderId',
    required: false,
    description: 'Restrict search to a specific folder UUID',
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
    description: 'Results per page (max 100)',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of matching files.',
    type: PaginatedFileSearchResultDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires files.search permission.',
  })
  async run(
    @Query('organizationId') organizationId: string,
    @Query('tags') tags?: string | string[],
    @Query('name') name?: string,
    @Query('mimeType') mimeType?: string,
    @Query('folderId') folderId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<FileRecordDto>> {
    const normalizedTags = tags
      ? Array.isArray(tags)
        ? tags
        : [tags]
      : undefined;

    return this.queryBus.execute(
      new SearchFilesQuery(
        organizationId,
        normalizedTags,
        name,
        mimeType,
        folderId,
        page,
        limit,
      ),
    );
  }
}
