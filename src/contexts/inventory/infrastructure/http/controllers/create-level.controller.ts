import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { CreateLevelCommand } from '../../../application/commands/create-level/create-level.command';
import { CreateLevelDto } from '../dtos/create-level.dto';

@ApiBearerAuth()
@ApiTags('Levels')
@Controller('levels')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateLevelController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @RequirePermissions(Permissions.LEVELS.CREATE)
  @ApiOperation({ summary: 'Create a new level' })
  @ApiResponse({ status: 201, description: 'Level created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'Level name already exists.' })
  async run(@Body() dto: CreateLevelDto): Promise<void> {
    await this.commandBus.execute(
      new CreateLevelCommand(dto.name, dto.sortOrder, dto.description),
    );
  }
}
