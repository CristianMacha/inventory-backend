import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Param, Patch, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { MoveFolderDto } from '../dtos/move-folder.dto';
import { MoveFolderCommand } from '@contexts/files/application/commands/move-folder/move-folder.command';

@ApiBearerAuth()
@ApiTags('Files')
@Controller('files/folders')
export class MoveFolderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':folderId/move')
  @RequirePermissions(Permissions.FILES.MOVE)
  @ApiOperation({
    summary: 'Move a folder',
    description:
      'Moves a folder to a new parent folder within the same organization. Send `targetParentId: null` to move it to root.',
  })
  @ApiParam({ name: 'folderId', description: 'Folder UUID to move' })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID',
  })
  @ApiResponse({ status: 200, description: 'Folder moved successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or circular reference.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires files.move permission.',
  })
  @ApiResponse({
    status: 404,
    description: 'Folder or target parent not found.',
  })
  async run(
    @Param('folderId') folderId: string,
    @Query('organizationId') organizationId: string,
    @Body() dto: MoveFolderDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new MoveFolderCommand(
        folderId,
        dto.targetParentId ?? null,
        organizationId,
      ),
    );
  }
}
