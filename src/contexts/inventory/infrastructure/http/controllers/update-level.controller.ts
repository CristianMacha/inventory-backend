import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { UpdateLevelCommand } from '../../../application/commands/update-level/update-level.command';
import { UpdateLevelDto } from '../dtos/update-level.dto';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

@ApiBearerAuth()
@ApiTags('Levels')
@Controller('levels')
export class UpdateLevelController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.LEVELS.UPDATE)
  @ApiOperation({ summary: 'Update a level' })
  @ApiParam({ name: 'id', type: String, description: 'Level UUID' })
  @ApiResponse({
    status: 200,
    description: 'Level updated successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Level not found.' })
  @ApiResponse({ status: 409, description: 'Level name already exists.' })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateLevelDto,
  ): Promise<MessageResponseDto> {
    await this.commandBus.execute(
      new UpdateLevelCommand(
        id,
        dto.name,
        dto.sortOrder,
        dto.description,
        dto.isActive,
      ),
    );
    return {
      statusCode: HttpStatus.OK,
      message: `Level with id ${id} updated successfully`,
    };
  }
}
