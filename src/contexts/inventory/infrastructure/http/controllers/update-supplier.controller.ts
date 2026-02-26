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
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { UpdateSupplierCommand } from '../../../application/commands/update-supplier/update-supplier.command';
import { UpdateSupplierDto } from '../dtos/update-supplier.dto';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

@ApiBearerAuth()
@ApiTags('Suppliers')
@Controller('suppliers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateSupplierController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.SUPPLIERS.UPDATE)
  @ApiOperation({ summary: 'Update a supplier' })
  @ApiParam({ name: 'id', type: String, description: 'Supplier UUID' })
  @ApiResponse({
    status: 200,
    description: 'Supplier updated successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Supplier not found.' })
  @ApiResponse({ status: 409, description: 'Supplier name already exists.' })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSupplierDto,
    @GetUser() user: AuthUserDto,
  ): Promise<MessageResponseDto> {
    await this.commandBus.execute(
      new UpdateSupplierCommand(
        id,
        user.id,
        dto.name,
        dto.abbreviation,
        dto.isActive,
      ),
    );
    return {
      statusCode: HttpStatus.OK,
      message: `Supplier with id ${id} updated successfully`,
    };
  }
}
