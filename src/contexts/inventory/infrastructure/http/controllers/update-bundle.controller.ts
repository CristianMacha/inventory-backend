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
import { UpdateBundleCommand } from '@contexts/inventory/application/commands/update-bundle/update-bundle.command';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { UpdateBundleDto } from '../dtos/update-bundle.dto';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

@ApiBearerAuth()
@ApiTags('Bundles')
@Controller('bundles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateBundleController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.BUNDLES.UPDATE)
  @ApiOperation({ summary: 'Update a bundle' })
  @ApiParam({ name: 'id', type: String, description: 'Bundle ID' })
  @ApiResponse({ status: 200, description: 'Bundle updated successfully', type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Bundle not found' })
  async run(
    @Param('id') id: string,
    @Body() dto: UpdateBundleDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new UpdateBundleCommand(id, user.id, dto.lotNumber, dto.thicknessCm),
    );
    return {
      statusCode: HttpStatus.OK,
      message: `Bundle with id ${id} updated successfully`,
    };
  }
}
