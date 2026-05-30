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
import { GetFileQuery } from '@contexts/files/application/queries/get-file/get-file.query';
import { FileRecordDto } from '@contexts/files/application/dtos/file-record.dto';

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files')
export class GetFileController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':fileId')
  @RequirePermissions(Permissions.FILES.READ)
  @ApiOperation({ summary: 'Get file detail' })
  @ApiParam({ name: 'fileId', description: 'File UUID' })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'File detail.',
    type: FileRecordDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Requires files.read permission. Also returns 403 if the organizationId does not belong to the authenticated user.',
  })
  @ApiResponse({ status: 404, description: 'File not found.' })
  async run(
    @Param('fileId') fileId: string,
    @Query('organizationId') organizationId: string,
  ): Promise<FileRecordDto> {
    return this.queryBus.execute(new GetFileQuery(fileId, organizationId));
  }
}
