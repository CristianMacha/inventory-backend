import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { PaymentType } from '../../../../domain/enums/payment-type.enum';
import { PaymentCategory } from '../../../../domain/enums/payment-category.enum';
import { PaymentMethod } from '../../../../domain/enums/payment-method.enum';

@Entity({ name: 'general_payments' })
@Index('IDX_general_payments_type', ['type'])
@Index('IDX_general_payments_category', ['category'])
@Index('IDX_general_payments_paymentDate', ['paymentDate'])
export class GeneralPaymentEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PaymentType })
  type: PaymentType;

  @Column({ type: 'enum', enum: PaymentCategory })
  category: PaymentCategory;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

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
