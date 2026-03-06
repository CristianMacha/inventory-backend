import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RecordGeneralPaymentCommand } from './record-general-payment.command';
import { ACCOUNTING_TOKENS } from '../../accounting.tokens';
import { IGeneralPaymentRepository } from '../../../domain/repositories/general-payment.repository';
import { GeneralPayment } from '../../../domain/entities/general-payment';

@CommandHandler(RecordGeneralPaymentCommand)
export class RecordGeneralPaymentHandler implements ICommandHandler<RecordGeneralPaymentCommand> {
  constructor(
    @Inject(ACCOUNTING_TOKENS.GENERAL_PAYMENT_REPOSITORY)
    private readonly generalPaymentRepository: IGeneralPaymentRepository,
  ) {}

  async execute(command: RecordGeneralPaymentCommand): Promise<string> {
    const {
      type,
      category,
      description,
      amount,
      paymentMethod,
      paymentDate,
      reference,
      userId,
    } = command;

    const payment = GeneralPayment.create(
      type,
      category,
      description,
      amount,
      paymentMethod,
      paymentDate,
      reference,
      userId,
    );

    await this.generalPaymentRepository.save(payment);

    return payment.id.getValue();
  }
}
