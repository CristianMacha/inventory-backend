import {
  ApiBearerAuth,
  ApiBody,
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
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { OrgAccessGuard } from '@contexts/files/infrastructure/guards/org-access.guard';
import { MoveFileDto } from '../dtos/move-file.dto';
import { MoveFileCommand } from '@contexts/files/application/commands/move-file/move-file.command';

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files')
export class MoveFileController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':fileId/move')
  @RequirePermissions(Permissions.FILES.MOVE)
  @ApiOperation({
    summary: 'Move a file to another folder',
    description:
      'Moves a file to a different folder within the same organization.',
  })
  @ApiParam({
    name: 'fileId',
    description: 'File UUID to move',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID that owns the file',
  })
  @ApiBody({ type: MoveFileDto })
  @ApiResponse({ status: 200, description: 'File moved successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires files.move permission. Also returns 403 if the organizationId does not belong to the authenticated user.',
  })
  @ApiResponse({
    status: 404,
    description:
      'File or target folder not found, or they do not belong to this organization.',
  })
  async run(
    @Param('fileId', new ParseUUIDPipe()) fileId: string,
    @Query('organizationId') organizationId: string,
    @Body() dto: MoveFileDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new MoveFileCommand(fileId, dto.targetFolderId, organizationId),
    );
  }
}
