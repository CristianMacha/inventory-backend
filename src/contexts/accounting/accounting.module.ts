import { forwardRef, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedInfrastructureModule } from '@shared/infrastructure/shared-infrastructure.module';
import { PurchasingModule } from '@contexts/purchasing/purchasing.module';
import { ProjectsModule } from '@contexts/projects/projects.module';
import { ACCOUNTING_TOKENS } from './application/accounting.tokens';

import { InvoicePaymentEntity } from './infrastructure/persistence/typeorm/entities/invoice-payment.entity';
import { JobPaymentEntity } from './infrastructure/persistence/typeorm/entities/job-payment.entity';
import { GeneralPaymentEntity } from './infrastructure/persistence/typeorm/entities/general-payment.entity';

import { TypeOrmInvoicePaymentRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-invoice-payment.repository';
import { TypeOrmJobPaymentRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-job-payment.repository';
import { TypeOrmGeneralPaymentRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-general-payment.repository';

import { RecordInvoicePaymentHandler } from './application/commands/record-invoice-payment/record-invoice-payment.handler';
import { RecordJobPaymentHandler } from './application/commands/record-job-payment/record-job-payment.handler';
import { RecordGeneralPaymentHandler } from './application/commands/record-general-payment/record-general-payment.handler';

import { GetInvoicePaymentsHandler } from './application/queries/get-invoice-payments/get-invoice-payments.handler';
import { GetJobPaymentsHandler } from './application/queries/get-job-payments/get-job-payments.handler';
import { ListInvoicePaymentsHandler } from './application/queries/list-invoice-payments/list-invoice-payments.handler';
import { ListJobPaymentsHandler } from './application/queries/list-job-payments/list-job-payments.handler';
import { GetCashflowSummaryHandler } from './application/queries/get-cashflow-summary/get-cashflow-summary.handler';
import { ListGeneralPaymentsHandler } from './application/queries/list-general-payments/list-general-payments.handler';

import { InvoicePaymentsController } from './infrastructure/http/controllers/invoice-payments.controller';
import { JobPaymentsController } from './infrastructure/http/controllers/job-payments.controller';
import { CashflowController } from './infrastructure/http/controllers/cashflow.controller';
import { GeneralPaymentsController } from './infrastructure/http/controllers/general-payments.controller';

const CommandHandlers = [
  RecordInvoicePaymentHandler,
  RecordJobPaymentHandler,
  RecordGeneralPaymentHandler,
];

const QueryHandlers = [
  GetInvoicePaymentsHandler,
  GetJobPaymentsHandler,
  ListInvoicePaymentsHandler,
  ListJobPaymentsHandler,
  GetCashflowSummaryHandler,
  ListGeneralPaymentsHandler,
];

const PersistenceProviders: Provider[] = [
  {
    provide: ACCOUNTING_TOKENS.INVOICE_PAYMENT_REPOSITORY,
    useClass: TypeOrmInvoicePaymentRepository,
  },
  {
    provide: ACCOUNTING_TOKENS.JOB_PAYMENT_REPOSITORY,
    useClass: TypeOrmJobPaymentRepository,
  },
  {
    provide: ACCOUNTING_TOKENS.GENERAL_PAYMENT_REPOSITORY,
    useClass: TypeOrmGeneralPaymentRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      InvoicePaymentEntity,
      JobPaymentEntity,
      GeneralPaymentEntity,
    ]),
    SharedInfrastructureModule,
    forwardRef(() => PurchasingModule),
    forwardRef(() => ProjectsModule),
  ],
  controllers: [
    InvoicePaymentsController,
    JobPaymentsController,
    CashflowController,
    GeneralPaymentsController,
  ],
  providers: [...CommandHandlers, ...QueryHandlers, ...PersistenceProviders],
  exports: [...PersistenceProviders],
})
export class AccountingModule {}
