import { InvoicePaymentId } from '../value-objects/invoice-payment-id';
import { PaymentMethod } from '../enums/payment-method.enum';
import { InvalidPaymentAmountException } from '../errors/invalid-payment-amount.exception';

export class InvoicePayment {
  private readonly _id: InvoicePaymentId;
  private readonly _invoiceId: string;
  private readonly _amount: number;
  private readonly _paymentMethod: PaymentMethod;
  private readonly _paymentDate: Date;
  private readonly _reference: string | null;
  private readonly _createdBy: string;
  private readonly _createdAt: Date;

  private constructor(
    id: InvoicePaymentId,
    invoiceId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: Date,
    reference: string | null,
    createdBy: string,
    createdAt: Date,
  ) {
    this._id = id;
    this._invoiceId = invoiceId;
    this._amount = amount;
    this._paymentMethod = paymentMethod;
    this._paymentDate = paymentDate;
    this._reference = reference;
    this._createdBy = createdBy;
    this._createdAt = createdAt;
  }

  static create(
    invoiceId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: Date,
    reference: string | null,
    createdBy: string,
  ): InvoicePayment {
    if (amount <= 0) {
      throw new InvalidPaymentAmountException();
    }
    return new InvoicePayment(
      InvoicePaymentId.generate(),
      invoiceId,
      amount,
      paymentMethod,
      paymentDate,
      reference,
      createdBy,
      new Date(),
    );
  }

  static reconstitute(
    id: InvoicePaymentId,
    invoiceId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: Date,
    reference: string | null,
    createdBy: string,
    createdAt: Date,
  ): InvoicePayment {
    return new InvoicePayment(
      id,
      invoiceId,
      amount,
      paymentMethod,
      paymentDate,
      reference,
      createdBy,
      createdAt,
    );
  }

  get id(): InvoicePaymentId {
    return this._id;
  }
  get invoiceId(): string {
    return this._invoiceId;
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
