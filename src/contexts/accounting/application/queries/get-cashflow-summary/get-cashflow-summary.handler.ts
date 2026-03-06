import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetCashflowSummaryQuery } from './get-cashflow-summary.query';
import { CashflowSummaryDto } from '../../dtos/cashflow-summary.dto';
import { ACCOUNTING_TOKENS } from '../../accounting.tokens';
import { IInvoicePaymentRepository } from '../../../domain/repositories/invoice-payment.repository';
import { IJobPaymentRepository } from '../../../domain/repositories/job-payment.repository';
import { IGeneralPaymentRepository } from '../../../domain/repositories/general-payment.repository';
import { PaymentType } from '../../../domain/enums/payment-type.enum';

@QueryHandler(GetCashflowSummaryQuery)
export class GetCashflowSummaryHandler implements IQueryHandler<GetCashflowSummaryQuery> {
  constructor(
    @Inject(ACCOUNTING_TOKENS.INVOICE_PAYMENT_REPOSITORY)
    private readonly invoicePaymentRepository: IInvoicePaymentRepository,
    @Inject(ACCOUNTING_TOKENS.JOB_PAYMENT_REPOSITORY)
    private readonly jobPaymentRepository: IJobPaymentRepository,
    @Inject(ACCOUNTING_TOKENS.GENERAL_PAYMENT_REPOSITORY)
    private readonly generalPaymentRepository: IGeneralPaymentRepository,
  ) {}

  async execute(query: GetCashflowSummaryQuery): Promise<CashflowSummaryDto> {
    const { fromDate, toDate } = query;

    const [jobIncome, invoiceExpenses, generalIncome, generalExpenses] =
      await Promise.all([
        this.jobPaymentRepository.sumAll(fromDate, toDate),
        this.invoicePaymentRepository.sumAll(fromDate, toDate),
        this.generalPaymentRepository.sumByType(
          PaymentType.INCOME,
          fromDate,
          toDate,
        ),
        this.generalPaymentRepository.sumByType(
          PaymentType.EXPENSE,
          fromDate,
          toDate,
        ),
      ]);

    const totalIngress = jobIncome + generalIncome;
    const totalEgress = invoiceExpenses + generalExpenses;

    return {
      totalIngress,
      totalEgress,
      cashBalance: totalIngress - totalEgress,
      jobIncome,
      generalIncome,
      invoiceExpenses,
      generalExpenses,
      fromDate: fromDate ? fromDate.toISOString().split('T')[0] : null,
      toDate: toDate ? toDate.toISOString().split('T')[0] : null,
    };
  }
}
