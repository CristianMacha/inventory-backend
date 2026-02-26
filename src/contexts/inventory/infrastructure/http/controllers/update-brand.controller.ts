import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { UpdateBrandCommand } from '@contexts/inventory/application/commands/update-brand/update-brand.command';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { UpdateBrandDto } from '../dtos/update-brand.dto';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

@ApiBearerAuth()
@ApiTags('Brands')
@Controller('brands')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateBrandController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.BRANDS.UPDATE)
  @ApiOperation({ summary: 'Update a brand' })
  @ApiParam({ name: 'id', type: String, description: 'Brand ID' })
  @ApiResponse({
    status: 200,
    description: 'Brand updated successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  @ApiResponse({ status: 409, description: 'Brand name already exists' })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBrandDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new UpdateBrandCommand(
        id,
        user.id,
        dto.name,
        dto.description,
        dto.isActive,
      ),
    );
    return {
      statusCode: HttpStatus.OK,
      message: `Brand with id ${id} updated successfully`,
    };
  }
}
