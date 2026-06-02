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

import { UpdateUserCommand } from '../../../application/commands/update-user/update-user.command';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UpdateUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id')
  @RequirePermissions(Permissions.USERS.UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user details' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'User ID',
  })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body or role not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async handle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
    @GetUser() user: AuthUserDto,
  ) {
    const command = new UpdateUserCommand(
      id,
      user.id,
      dto.name,
      dto.roleNames,
      dto.organizationId,
    );
    await this.commandBus.execute(command);

    return {
      statusCode: HttpStatus.OK,
      message: `User with id ${id} updated successfully`,
    };
  }
}
