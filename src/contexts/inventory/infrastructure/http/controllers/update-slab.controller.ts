import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
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
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { UpdateSlabCommand } from '@contexts/inventory/application/commands/update-slab/update-slab.command';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { UpdateSlabDto } from '../dtos/update-slab.dto';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

@ApiBearerAuth()
@ApiTags('Slabs')
@Controller('slabs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateSlabController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.SLABS.UPDATE)
  @ApiOperation({ summary: 'Update slab status or description' })
  @ApiParam({ name: 'id', type: String, description: 'Slab ID' })
  @ApiResponse({ status: 200, description: 'Slab updated successfully', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Slab not found' })
  async run(
    @Param('id') id: string,
    @Body() dto: UpdateSlabDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new UpdateSlabCommand(id, user.id, dto.status, dto.description),
    );
    return {
      statusCode: HttpStatus.OK,
      message: `Slab with id ${id} updated successfully`,
    };
  }
}
