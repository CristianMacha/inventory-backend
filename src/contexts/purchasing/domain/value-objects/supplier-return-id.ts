import { v4 as uuidv4 } from 'uuid';

export class SupplierReturnId {
  private constructor(private readonly value: string) {}

  static generate(): SupplierReturnId {
    return new SupplierReturnId(uuidv4());
  }

  static create(value: string): SupplierReturnId {
    return new SupplierReturnId(value);
  }

  getValue(): string {
    return this.value;
  }
}
