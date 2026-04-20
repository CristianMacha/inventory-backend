import {
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

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { MarkSlabAsReturningCommand } from '@contexts/inventory/application/commands/mark-slab-as-returning/mark-slab-as-returning.command';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

@ApiBearerAuth()
@ApiTags('Slabs')
@Controller('slabs')
export class MarkSlabAsReturningController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/mark-as-returning')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.SLABS.UPDATE)
  @ApiOperation({ summary: 'Mark a slab as returning to supplier' })
  @ApiParam({ name: 'id', type: String, description: 'Slab ID' })
  @ApiResponse({
    status: 200,
    description: 'Slab marked as returning successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Slab not found' })
  @ApiResponse({ status: 409, description: 'Invalid status transition' })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new MarkSlabAsReturningCommand(id, user.id));
    return {
      statusCode: HttpStatus.OK,
      message: `Slab ${id} marked as returning successfully`,
    };
  }
}
