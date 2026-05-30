import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Patch, Query, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { OrgAccessGuard } from '@contexts/files/infrastructure/guards/org-access.guard';
import { BulkMoveFilesDto } from '../dtos/bulk-move-files.dto';
import { BulkMoveFilesCommand } from '@contexts/files/application/commands/bulk-move-files/bulk-move-files.command';

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files')
export class BulkMoveFilesController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('bulk-move')
  @RequirePermissions(Permissions.FILES.MOVE)
  @ApiOperation({
    summary: 'Move multiple files to a folder',
    description:
      'Moves all specified files to the target folder in a single operation.',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'Files moved. Returns count of moved files.',
    schema: { example: { moved: 3 } },
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Requires files.move permission. Also returns 403 if the organizationId does not belong to the authenticated user.',
  })
  @ApiResponse({
    status: 404,
    description: 'A file or the target folder was not found.',
  })
  async run(
    @Query('organizationId') organizationId: string,
    @Body() dto: BulkMoveFilesDto,
  ): Promise<{ moved: number }> {
    return this.commandBus.execute(
      new BulkMoveFilesCommand(dto.fileIds, dto.targetFolderId, organizationId),
    );
  }
}
