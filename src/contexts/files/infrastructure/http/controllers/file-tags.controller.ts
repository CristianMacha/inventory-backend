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
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { AddTagsDto } from '../dtos/add-tags.dto';
import { AddTagsCommand } from '@contexts/files/application/commands/add-tags/add-tags.command';
import { RemoveTagsCommand } from '@contexts/files/application/commands/remove-tags/remove-tags.command';

@ApiBearerAuth()
@ApiTags('Files')
@Controller('files')
export class FileTagsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':fileId/tags')
  @RequirePermissions(Permissions.FILES.TAG)
  @ApiOperation({
    summary: 'Add tags to a file',
    description:
      'Adds one or more tags to a file. Tags are normalized to lowercase. Duplicate tags are ignored.',
  })
  @ApiParam({
    name: 'fileId',
    description: 'File UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID that owns the file',
  })
  @ApiBody({ type: AddTagsDto })
  @ApiResponse({ status: 200, description: 'Tags added successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or empty tags array.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires files.tag permission.',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found or does not belong to this organization.',
  })
  async addTags(
    @Param('fileId', new ParseUUIDPipe()) fileId: string,
    @Query('organizationId') organizationId: string,
    @Body() dto: AddTagsDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new AddTagsCommand(fileId, organizationId, dto.tags),
    );
  }

  @Delete(':fileId/tags')
  @RequirePermissions(Permissions.FILES.TAG)
  @ApiOperation({
    summary: 'Remove tags from a file',
    description:
      'Removes one or more tags from a file. Tags not present on the file are silently ignored.',
  })
  @ApiParam({
    name: 'fileId',
    description: 'File UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID that owns the file',
  })
  @ApiBody({ type: AddTagsDto })
  @ApiResponse({ status: 200, description: 'Tags removed successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or empty tags array.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires files.tag permission.',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found or does not belong to this organization.',
  })
  async removeTags(
    @Param('fileId', new ParseUUIDPipe()) fileId: string,
    @Query('organizationId') organizationId: string,
    @Body() dto: AddTagsDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new RemoveTagsCommand(fileId, organizationId, dto.tags),
    );
  }
}
