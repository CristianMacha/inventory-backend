import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ListGeneralPaymentsQuery } from './list-general-payments.query';
import { GeneralPaymentsPageDto } from '../../dtos/general-payment-output.dto';
import { ACCOUNTING_TOKENS } from '../../accounting.tokens';
import { IGeneralPaymentRepository } from '../../../domain/repositories/general-payment.repository';
import { GeneralPaymentResponseMapper } from '../../mappers/general-payment-response.mapper';

@QueryHandler(ListGeneralPaymentsQuery)
export class ListGeneralPaymentsHandler implements IQueryHandler<ListGeneralPaymentsQuery> {
  constructor(
    @Inject(ACCOUNTING_TOKENS.GENERAL_PAYMENT_REPOSITORY)
    private readonly generalPaymentRepository: IGeneralPaymentRepository,
  ) {}

  async execute(
    query: ListGeneralPaymentsQuery,
  ): Promise<GeneralPaymentsPageDto> {
    const { pagination, type, category, paymentMethod, fromDate, toDate } =
      query;

    const result = await this.generalPaymentRepository.findPaginated(
      { type, category, paymentMethod, fromDate, toDate },
      pagination,
    );

    return {
      payments: result.data.map((e) =>
        GeneralPaymentResponseMapper.toResponse(e),
      ),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
