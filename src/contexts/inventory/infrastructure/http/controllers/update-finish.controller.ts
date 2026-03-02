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
import { UpdateFinishCommand } from '../../../application/commands/update-finish/update-finish.command';
import { UpdateFinishDto } from '../dtos/update-finish.dto';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

@ApiBearerAuth()
@ApiTags('Finishes')
@Controller('finishes')
export class UpdateFinishController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.FINISHES.UPDATE)
  @ApiOperation({ summary: 'Update a finish' })
  @ApiParam({ name: 'id', type: String, description: 'Finish UUID' })
  @ApiResponse({
    status: 200,
    description: 'Finish updated successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Finish not found.' })
  @ApiResponse({ status: 409, description: 'Finish name already exists.' })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateFinishDto,
  ): Promise<MessageResponseDto> {
    await this.commandBus.execute(
      new UpdateFinishCommand(
        id,
        dto.name,
        dto.abbreviation,
        dto.description,
        dto.isActive,
      ),
    );
    return {
      statusCode: HttpStatus.OK,
      message: `Finish with id ${id} updated successfully`,
    };
  }
}
