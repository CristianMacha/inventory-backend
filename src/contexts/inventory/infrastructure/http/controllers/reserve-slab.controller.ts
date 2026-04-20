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
import { ReserveSlabCommand } from '@contexts/inventory/application/commands/reserve-slab/reserve-slab.command';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

@ApiBearerAuth()
@ApiTags('Slabs')
@Controller('slabs')
export class ReserveSlabController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/reserve')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.SLABS.UPDATE)
  @ApiOperation({ summary: 'Reserve a slab' })
  @ApiParam({ name: 'id', type: String, description: 'Slab ID' })
  @ApiResponse({
    status: 200,
    description: 'Slab reserved successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Slab not found' })
  @ApiResponse({ status: 409, description: 'Invalid status transition' })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new ReserveSlabCommand(id, user.id));
    return {
      statusCode: HttpStatus.OK,
      message: `Slab ${id} reserved successfully`,
    };
  }
}
