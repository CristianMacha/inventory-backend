import { v4 as uuidv4 } from 'uuid';

export class SupplierReturnItemId {
  private constructor(private readonly value: string) {}

  static generate(): SupplierReturnItemId {
    return new SupplierReturnItemId(uuidv4());
  }

  static create(value: string): SupplierReturnItemId {
    return new SupplierReturnItemId(value);
  }

  getValue(): string {
    return this.value;
  }
}
