import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Permissions } from '@shared/authorization/permissions';
import { CreateFolderDto } from '../dtos/create-folder.dto';
import { CreateFolderCommand } from '@contexts/files/application/commands/create-folder/create-folder.command';

@ApiBearerAuth()
@ApiTags('Files')
@Controller('files/folders')
export class CreateFolderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @RequirePermissions(Permissions.FILES.CREATE_FOLDER)
  @ApiOperation({
    summary: 'Create a folder',
    description:
      'Creates a folder inside an organization. Omit `parentId` to create a root-level folder.',
  })
  @ApiResponse({
    status: 201,
    description: 'Folder created. Returns the new folder ID.',
    schema: { example: { id: 'uuid' } },
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires files.create_folder permission.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Parent folder not found or does not belong to this organization.',
  })
  async run(
    @Body() dto: CreateFolderDto,
    @GetUser() user: AuthUserDto,
  ): Promise<{ id: string }> {
    return this.commandBus.execute(
      new CreateFolderCommand(
        dto.name,
        dto.organizationId,
        user.id,
        dto.parentId ?? null,
      ),
    );
  }
}
