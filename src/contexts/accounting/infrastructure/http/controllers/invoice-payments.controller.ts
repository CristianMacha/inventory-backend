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

import { RecordInvoicePaymentCommand } from '../../../application/commands/record-invoice-payment/record-invoice-payment.command';
import { GetInvoicePaymentsQuery } from '../../../application/queries/get-invoice-payments/get-invoice-payments.query';
import { ListInvoicePaymentsQuery } from '../../../application/queries/list-invoice-payments/list-invoice-payments.query';
import {
  InvoicePaymentsWithSummaryDto,
  InvoicePaymentsPageDto,
} from '../../../application/dtos/invoice-payment-output.dto';
import { RecordInvoicePaymentDto } from '../dtos/record-invoice-payment.dto';
import { GetInvoicePaymentsQueryDto } from '../dtos/get-invoice-payments-query.dto';

@ApiBearerAuth()
@ApiTags('Invoice Payments')
@Controller('invoice-payments')
export class InvoicePaymentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermissions(Permissions.INVOICE_PAYMENTS.CREATE)
  @ApiOperation({ summary: 'Record a payment for a purchase invoice' })
  @ApiResponse({ status: 201, description: 'Payment recorded' })
  @ApiResponse({
    status: 422,
    description: 'Payment exceeds balance or invoice not payable',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async create(
    @Body() dto: RecordInvoicePaymentDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new RecordInvoicePaymentCommand(
        dto.invoiceId,
        dto.amount,
        dto.paymentMethod,
        new Date(dto.paymentDate),
        dto.reference ?? null,
        user.id,
      ),
    );
    return { statusCode: HttpStatus.CREATED, message: 'Payment recorded' };
  }

  @Get('invoice/:invoiceId')
  @RequirePermissions(Permissions.INVOICE_PAYMENTS.READ)
  @ApiOperation({ summary: 'Get payments for a purchase invoice' })
  @ApiParam({ name: 'invoiceId', description: 'Invoice UUID' })
  @ApiResponse({ status: 200, type: InvoicePaymentsWithSummaryDto })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async getByInvoice(
    @Param('invoiceId', new ParseUUIDPipe()) invoiceId: string,
  ): Promise<InvoicePaymentsWithSummaryDto> {
    return this.queryBus.execute(new GetInvoicePaymentsQuery(invoiceId));
  }

  @Get()
  @RequirePermissions(Permissions.INVOICE_PAYMENTS.READ)
  @ApiOperation({ summary: 'Get paginated payments for a purchase invoice' })
  @ApiQuery({ name: 'invoiceId', required: true, description: 'Invoice UUID' })
  @ApiQuery({
    name: 'paymentMethod',
    required: false,
    enum: ['CASH', 'BANK_TRANSFER'],
  })
  @ApiQuery({ name: 'fromDate', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'toDate', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: InvoicePaymentsPageDto })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async findPaginated(
    @Query() queryDto: GetInvoicePaymentsQueryDto,
  ): Promise<InvoicePaymentsPageDto> {
    return this.queryBus.execute(
      new ListInvoicePaymentsQuery(
        queryDto.toPaginationParams(),
        queryDto.paymentMethod,
        queryDto.fromDate ? new Date(queryDto.fromDate) : undefined,
        queryDto.toDate ? new Date(queryDto.toDate) : undefined,
      ),
    );
  }
}
