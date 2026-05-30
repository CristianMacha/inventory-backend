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
import { DeleteFileCommand } from '@contexts/files/application/commands/delete-file/delete-file.command';

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files')
export class DeleteFileController {
  constructor(private readonly commandBus: CommandBus) {}

  @Delete(':fileId')
  @RequirePermissions(Permissions.FILES.DELETE)
  @ApiOperation({
    summary: 'Delete a file permanently',
    description:
      'Deletes the file from Firebase Storage and removes its record from the database. Also frees the storage quota used by the file in the organization.',
  })
  @ApiParam({
    name: 'fileId',
    description: 'File UUID to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID that owns the file',
  })
  @ApiResponse({ status: 200, description: 'File deleted successfully.' })
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
    description: 'File not found or does not belong to this organization.',
  })
  async run(
    @Param('fileId', new ParseUUIDPipe()) fileId: string,
    @Query('organizationId') organizationId: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new DeleteFileCommand(fileId, organizationId),
    );
  }
}
