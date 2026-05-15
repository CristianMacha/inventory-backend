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
import { RenameFileDto } from '../dtos/rename-file.dto';
import { RenameFileCommand } from '@contexts/files/application/commands/rename-file/rename-file.command';

@ApiBearerAuth()
@ApiTags('Files')
@Controller('files')
export class RenameFileController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':fileId/rename')
  @RequirePermissions(Permissions.FILES.MOVE)
  @ApiOperation({ summary: 'Rename a file' })
  @ApiParam({ name: 'fileId', description: 'File UUID' })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID',
  })
  @ApiResponse({ status: 200, description: 'File renamed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'File not found.' })
  async run(
    @Param('fileId') fileId: string,
    @Query('organizationId') organizationId: string,
    @Body() dto: RenameFileDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new RenameFileCommand(fileId, dto.name, organizationId),
    );
  }
}
