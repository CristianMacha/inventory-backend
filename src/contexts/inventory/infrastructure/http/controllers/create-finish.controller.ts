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
import { CreateFinishCommand } from '../../../application/commands/create-finish/create-finish.command';
import { CreateFinishDto } from '../dtos/create-finish.dto';

@ApiBearerAuth()
@ApiTags('Finishes')
@Controller('finishes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateFinishController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @RequirePermissions(Permissions.FINISHES.CREATE)
  @ApiOperation({ summary: 'Create a new finish' })
  @ApiResponse({ status: 201, description: 'Finish created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'Finish name already exists.' })
  async run(@Body() dto: CreateFinishDto): Promise<void> {
    await this.commandBus.execute(
      new CreateFinishCommand(dto.name, dto.abbreviation, dto.description),
    );
  }
}
