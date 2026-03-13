import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Permissions } from '@shared/authorization/permissions';

import { RecordGeneralPaymentCommand } from '../../../application/commands/record-general-payment/record-general-payment.command';
import { ListGeneralPaymentsQuery } from '../../../application/queries/list-general-payments/list-general-payments.query';
import { GeneralPaymentsPageDto } from '../../../application/dtos/general-payment-output.dto';
import { RecordGeneralPaymentDto } from '../dtos/record-general-payment.dto';
import { GetGeneralPaymentsQueryDto } from '../dtos/get-general-payments-query.dto';

@ApiBearerAuth()
@ApiTags('General Payments')
@Controller('general-payments')
export class GeneralPaymentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermissions(Permissions.GENERAL_PAYMENTS.CREATE)
  @ApiOperation({ summary: 'Record a general payment (income or expense)' })
  @ApiResponse({ status: 201, description: 'Payment recorded' })
  @ApiResponse({ status: 422, description: 'Invalid payment amount' })
  async create(
    @Body() dto: RecordGeneralPaymentDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new RecordGeneralPaymentCommand(
        dto.type,
        dto.category,
        dto.description ?? null,
        dto.amount,
        dto.paymentMethod,
        new Date(dto.paymentDate),
        dto.reference ?? null,
        user.id,
      ),
    );
    return { statusCode: HttpStatus.CREATED, message: 'Payment recorded' };
  }

  @Get()
  @RequirePermissions(Permissions.GENERAL_PAYMENTS.READ)
  @ApiOperation({ summary: 'List general payments with optional filters' })
  @ApiResponse({ status: 200, type: GeneralPaymentsPageDto })
  async findPaginated(
    @Query() queryDto: GetGeneralPaymentsQueryDto,
  ): Promise<GeneralPaymentsPageDto> {
    return this.queryBus.execute(
      new ListGeneralPaymentsQuery(
        queryDto.toPaginationParams(),
        queryDto.type,
        queryDto.category,
        queryDto.paymentMethod,
        queryDto.fromDate ? new Date(queryDto.fromDate) : undefined,
        queryDto.toDate ? new Date(queryDto.toDate) : undefined,
      ),
    );
  }
}
