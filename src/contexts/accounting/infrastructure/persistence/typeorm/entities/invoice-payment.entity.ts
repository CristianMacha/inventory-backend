import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { PaymentMethod } from '../../../../domain/enums/payment-method.enum';

@Entity({ name: 'invoice_payments' })
@Index('IDX_invoice_payments_invoiceId', ['invoiceId'])
@Index('IDX_invoice_payments_paymentDate', ['paymentDate'])
export class InvoicePaymentEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  invoiceId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'date' })
  paymentDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  createdBy: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
