import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { CreateSlabCommand } from '../../../application/commands/create-slab/create-slab.command';
import { CreateSlabDto } from '../dtos/create-slab.dto';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Slabs')
@Controller('slabs')
export class CreateSlabController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @RequirePermissions(Permissions.SLABS.CREATE)
  @ApiOperation({ summary: 'Create a new slab' })
  @ApiResponse({ status: 201, description: 'Slab created successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User lacks required permissions.',
  })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input data.' })
  async run(
    @Body() dto: CreateSlabDto,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new CreateSlabCommand(
        dto.bundleId,
        dto.code,
        dto.widthCm,
        dto.heightCm,
        user.id,
        dto.description,
      ),
    );
  }
}
