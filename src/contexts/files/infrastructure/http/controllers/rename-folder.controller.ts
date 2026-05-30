import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { OrgAccessGuard } from '@contexts/files/infrastructure/guards/org-access.guard';
import { RenameFolderDto } from '../dtos/rename-folder.dto';
import { RenameFolderCommand } from '@contexts/files/application/commands/rename-folder/rename-folder.command';

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files/folders')
export class RenameFolderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':folderId')
  @RequirePermissions(Permissions.FILES.CREATE_FOLDER)
  @ApiOperation({ summary: 'Rename a folder' })
  @ApiParam({ name: 'folderId', description: 'Folder UUID' })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID',
  })
  @ApiResponse({ status: 200, description: 'Folder renamed successfully.' })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input. `name` is required and must not exceed 255 characters.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Requires files.create_folder permission or the organizationId does not belong to the authenticated user.',
  })
  @ApiResponse({
    status: 404,
    description: 'Folder not found or does not belong to this organization.',
  })
  async run(
    @Param('folderId') folderId: string,
    @Query('organizationId') organizationId: string,
    @Body() dto: RenameFolderDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new RenameFolderCommand(folderId, dto.name, organizationId),
    );
  }
}
