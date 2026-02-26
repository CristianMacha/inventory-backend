import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

import { CreateJobCommand } from '../../../application/commands/create-job/create-job.command';
import { AddJobItemCommand } from '../../../application/commands/add-job-item/add-job-item.command';
import { RemoveJobItemCommand } from '../../../application/commands/remove-job-item/remove-job-item.command';
import { ApproveJobCommand } from '../../../application/commands/approve-job/approve-job.command';
import { StartJobCommand } from '../../../application/commands/start-job/start-job.command';
import { CompleteJobCommand } from '../../../application/commands/complete-job/complete-job.command';
import { CancelJobCommand } from '../../../application/commands/cancel-job/cancel-job.command';
import { GetJobsQuery } from '../../../application/queries/get-jobs/get-jobs.query';
import { GetJobByIdQuery } from '../../../application/queries/get-job-by-id/get-job-by-id.query';
import {
  JobOutputDto,
  JobDetailOutputDto,
} from '../../../application/dtos/job-output.dto';
import { CreateJobDto } from '../dtos/create-job.dto';
import { AddJobItemDto } from '../dtos/add-job-item.dto';
import {
  GetJobsQueryDto,
  toPaginationParams,
} from '../dtos/get-jobs-query.dto';

@ApiBearerAuth()
@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class JobsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermissions(Permissions.JOBS.CREATE)
  @ApiOperation({ summary: 'Create a new job/project' })
  @ApiResponse({ status: 201, description: 'Job created' })
  async create(@Body() dto: CreateJobDto, @GetUser() user: AuthUserDto) {
    const id = await this.commandBus.execute(
      new CreateJobCommand(
        dto.projectName,
        dto.clientName,
        user.id,
        dto.clientPhone,
        dto.clientEmail,
        dto.clientAddress,
        dto.notes,
        dto.scheduledDate ? new Date(dto.scheduledDate) : null,
      ),
    );
    return { statusCode: HttpStatus.CREATED, message: 'Job created', id };
  }

  @Get()
  @RequirePermissions(Permissions.JOBS.READ)
  @ApiOperation({ summary: 'List jobs with filters and pagination' })
  @ApiResponse({ status: 200, type: JobOutputDto, isArray: true })
  async list(
    @Query() query: GetJobsQueryDto,
  ): Promise<PaginatedResult<JobOutputDto>> {
    return this.queryBus.execute(
      new GetJobsQuery(toPaginationParams(query), query.status, query.search),
    );
  }

  @Get(':id')
  @RequirePermissions(Permissions.JOBS.READ)
  @ApiOperation({ summary: 'Get job by ID with items' })
  @ApiParam({ name: 'id', description: 'Job UUID' })
  @ApiResponse({ status: 200, type: JobDetailOutputDto })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<JobDetailOutputDto> {
    return this.queryBus.execute(new GetJobByIdQuery(id));
  }

  @Post(':id/items')
  @RequirePermissions(Permissions.JOBS.UPDATE)
  @ApiOperation({ summary: 'Add a slab item to a job' })
  @ApiParam({ name: 'id', description: 'Job UUID' })
  @ApiResponse({ status: 201, description: 'Item added' })
  async addItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddJobItemDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new AddJobItemCommand(
        id,
        dto.slabId,
        dto.description ?? '',
        dto.unitPrice,
        user.id,
      ),
    );
    return { statusCode: HttpStatus.CREATED, message: 'Item added to job' };
  }

  @Delete(':id/items/:itemId')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.JOBS.UPDATE)
  @ApiOperation({ summary: 'Remove an item from a job' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async removeItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new RemoveJobItemCommand(id, itemId, user.id),
    );
    return { statusCode: HttpStatus.OK, message: 'Item removed from job' };
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.JOBS.UPDATE)
  @ApiOperation({ summary: 'Approve a quoted job (reserves slabs)' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async approve(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new ApproveJobCommand(id, user.id));
    return { statusCode: HttpStatus.OK, message: 'Job approved' };
  }

  @Patch(':id/start')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.JOBS.UPDATE)
  @ApiOperation({ summary: 'Start an approved job' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async start(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new StartJobCommand(id, user.id));
    return { statusCode: HttpStatus.OK, message: 'Job started' };
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.JOBS.UPDATE)
  @ApiOperation({
    summary: 'Complete an in-progress job (marks slabs as sold)',
  })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async complete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new CompleteJobCommand(id, user.id));
    return { statusCode: HttpStatus.OK, message: 'Job completed' };
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.JOBS.UPDATE)
  @ApiOperation({ summary: 'Cancel a job (releases reserved slabs)' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async cancel(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new CancelJobCommand(id, user.id));
    return { statusCode: HttpStatus.OK, message: 'Job cancelled' };
  }
}
