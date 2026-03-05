import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { PaymentMethod } from '../../../../domain/enums/payment-method.enum';

@Entity({ name: 'job_payments' })
@Index('IDX_job_payments_jobId', ['jobId'])
@Index('IDX_job_payments_paymentDate', ['paymentDate'])
export class JobPaymentEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  jobId: string;

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
