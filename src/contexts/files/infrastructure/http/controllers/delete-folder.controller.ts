import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { OrgAccessGuard } from '@contexts/files/infrastructure/guards/org-access.guard';
import { DeleteFolderCommand } from '@contexts/files/application/commands/delete-folder/delete-folder.command';

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files/folders')
export class DeleteFolderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(':folderId')
  @RequirePermissions(Permissions.FILES.DELETE)
  @ApiOperation({
    summary: 'Delete an empty folder',
    description:
      'Deletes a folder only if it has no subfolders and no files. Returns 422 if the folder is not empty.',
  })
  @ApiParam({
    name: 'folderId',
    description: 'Folder UUID to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID that owns the folder',
  })
  @ApiResponse({ status: 200, description: 'Folder deleted successfully.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires files.delete permission. Also returns 403 if the organizationId does not belong to the authenticated user.',
  })
  @ApiResponse({
    status: 404,
    description: 'Folder not found or does not belong to this organization.',
  })
  @ApiResponse({
    status: 422,
    description: 'Folder is not empty. Delete or move its contents first.',
  })
  async run(
    @Param('folderId', new ParseUUIDPipe()) folderId: string,
    @Query('organizationId') organizationId: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new DeleteFolderCommand(folderId, organizationId),
    );
  }
}
