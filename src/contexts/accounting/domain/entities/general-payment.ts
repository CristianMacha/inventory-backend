import { GeneralPaymentId } from '../value-objects/general-payment-id';
import { PaymentType } from '../enums/payment-type.enum';
import { PaymentCategory } from '../enums/payment-category.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { InvalidPaymentAmountException } from '../errors/invalid-payment-amount.exception';

export class GeneralPayment {
  private readonly _id: GeneralPaymentId;
  private readonly _type: PaymentType;
  private readonly _category: PaymentCategory;
  private readonly _description: string | null;
  private readonly _amount: number;
  private readonly _paymentMethod: PaymentMethod;
  private readonly _paymentDate: Date;
  private readonly _reference: string | null;
  private readonly _createdBy: string;
  private readonly _createdAt: Date;

  private constructor(
    id: GeneralPaymentId,
    type: PaymentType,
    category: PaymentCategory,
    description: string | null,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: Date,
    reference: string | null,
    createdBy: string,
    createdAt: Date,
  ) {
    this._id = id;
    this._type = type;
    this._category = category;
    this._description = description;
    this._amount = amount;
    this._paymentMethod = paymentMethod;
    this._paymentDate = paymentDate;
    this._reference = reference;
    this._createdBy = createdBy;
    this._createdAt = createdAt;
  }

  static create(
    type: PaymentType,
    category: PaymentCategory,
    description: string | null,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: Date,
    reference: string | null,
    createdBy: string,
  ): GeneralPayment {
    if (amount <= 0) {
      throw new InvalidPaymentAmountException();
    }
    return new GeneralPayment(
      GeneralPaymentId.generate(),
      type,
      category,
      description,
      amount,
      paymentMethod,
      paymentDate,
      reference,
      createdBy,
      new Date(),
    );
  }

  static reconstitute(
    id: GeneralPaymentId,
    type: PaymentType,
    category: PaymentCategory,
    description: string | null,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: Date,
    reference: string | null,
    createdBy: string,
    createdAt: Date,
  ): GeneralPayment {
    return new GeneralPayment(
      id,
      type,
      category,
      description,
      amount,
      paymentMethod,
      paymentDate,
      reference,
      createdBy,
      createdAt,
    );
  }

  get id(): GeneralPaymentId {
    return this._id;
  }
  get type(): PaymentType {
    return this._type;
  }
  get category(): PaymentCategory {
    return this._category;
  }
  get description(): string | null {
    return this._description;
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
