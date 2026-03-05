import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Permissions } from '@shared/authorization/permissions';

import { RecordJobPaymentCommand } from '../../../application/commands/record-job-payment/record-job-payment.command';
import { GetJobPaymentsQuery } from '../../../application/queries/get-job-payments/get-job-payments.query';
import { ListJobPaymentsQuery } from '../../../application/queries/list-job-payments/list-job-payments.query';
import {
  JobPaymentsWithSummaryDto,
  JobPaymentsPageDto,
} from '../../../application/dtos/job-payment-output.dto';
import { RecordJobPaymentDto } from '../dtos/record-job-payment.dto';
import { GetJobPaymentsQueryDto } from '../dtos/get-job-payments-query.dto';

@ApiBearerAuth()
@ApiTags('Job Payments')
@Controller('job-payments')
export class JobPaymentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermissions(Permissions.JOB_PAYMENTS.CREATE)
  @ApiOperation({
    summary: 'Record a payment received from a client for a job',
  })
  @ApiResponse({ status: 201, description: 'Payment recorded' })
  @ApiResponse({
    status: 422,
    description: 'Payment exceeds balance or job not collectible',
  })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async create(@Body() dto: RecordJobPaymentDto, @GetUser() user: AuthUserDto) {
    const id = await this.commandBus.execute(
      new RecordJobPaymentCommand(
        dto.jobId,
        dto.amount,
        dto.paymentMethod,
        new Date(dto.paymentDate),
        dto.reference ?? null,
        user.id,
      ),
    );
    return { statusCode: HttpStatus.CREATED, message: 'Payment recorded', id };
  }

  @Get('job/:jobId')
  @RequirePermissions(Permissions.JOB_PAYMENTS.READ)
  @ApiOperation({ summary: 'Get payments received for a job' })
  @ApiParam({ name: 'jobId', description: 'Job UUID' })
  @ApiResponse({ status: 200, type: JobPaymentsWithSummaryDto })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getByJob(
    @Param('jobId', new ParseUUIDPipe()) jobId: string,
  ): Promise<JobPaymentsWithSummaryDto> {
    return this.queryBus.execute(new GetJobPaymentsQuery(jobId));
  }

  @Get()
  @RequirePermissions(Permissions.JOB_PAYMENTS.READ)
  @ApiOperation({ summary: 'Get paginated payments for a job' })
  @ApiQuery({ name: 'jobId', required: true, description: 'Job UUID' })
  @ApiQuery({
    name: 'paymentMethod',
    required: false,
    enum: ['CASH', 'BANK_TRANSFER'],
  })
  @ApiQuery({ name: 'fromDate', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'toDate', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: JobPaymentsPageDto })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async findPaginated(
    @Query() queryDto: GetJobPaymentsQueryDto,
  ): Promise<JobPaymentsPageDto> {
    return this.queryBus.execute(
      new ListJobPaymentsQuery(
        queryDto.toPaginationParams(),
        queryDto.paymentMethod,
        queryDto.fromDate ? new Date(queryDto.fromDate) : undefined,
        queryDto.toDate ? new Date(queryDto.toDate) : undefined,
      ),
    );
  }
}
