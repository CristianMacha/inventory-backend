import { JobPaymentId } from '../value-objects/job-payment-id';
import { PaymentMethod } from '../enums/payment-method.enum';
import { InvalidPaymentAmountException } from '../errors/invalid-payment-amount.exception';

export class JobPayment {
  private readonly _id: JobPaymentId;
  private readonly _jobId: string;
  private readonly _amount: number;
  private readonly _paymentMethod: PaymentMethod;
  private readonly _paymentDate: Date;
  private readonly _reference: string | null;
  private readonly _createdBy: string;
  private readonly _createdAt: Date;

  private constructor(
    id: JobPaymentId,
    jobId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: Date,
    reference: string | null,
    createdBy: string,
    createdAt: Date,
  ) {
    this._id = id;
    this._jobId = jobId;
    this._amount = amount;
    this._paymentMethod = paymentMethod;
    this._paymentDate = paymentDate;
    this._reference = reference;
    this._createdBy = createdBy;
    this._createdAt = createdAt;
  }

  static create(
    jobId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: Date,
    reference: string | null,
    createdBy: string,
  ): JobPayment {
    if (amount <= 0) {
      throw new InvalidPaymentAmountException();
    }
    return new JobPayment(
      JobPaymentId.generate(),
      jobId,
      amount,
      paymentMethod,
      paymentDate,
      reference,
      createdBy,
      new Date(),
    );
  }

  static reconstitute(
    id: JobPaymentId,
    jobId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: Date,
    reference: string | null,
    createdBy: string,
    createdAt: Date,
  ): JobPayment {
    return new JobPayment(
      id,
      jobId,
      amount,
      paymentMethod,
      paymentDate,
      reference,
      createdBy,
      createdAt,
    );
  }

  get id(): JobPaymentId {
    return this._id;
  }
  get jobId(): string {
    return this._jobId;
  }
  get amount(): number {
    return this._amount;
  }
  get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }
  get paymentDate(): Date {
    return this._paymentDate;
  }
  get reference(): string | null {
    return this._reference;
  }
  get createdBy(): string {
    return this._createdBy;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
