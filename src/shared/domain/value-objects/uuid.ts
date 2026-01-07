import { validate as uuidValidate, v4 as uuidV4 } from 'uuid';

export abstract class UUID {
  protected readonly value: string;

  protected constructor(value: string) {
    this.ensureIsValidUuid(value);
    this.value = value;
  }

  private ensureIsValidUuid(value: string) {
    if (!uuidValidate(value)) {
      throw new Error(`[${this.constructor.name}] Invalid UUID: ${value}`);
    }
  }

  public static randomGenerator(): string {
    return uuidV4();
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: UUID): boolean {
    return (
      other !== null &&
      other !== undefined &&
      Object.getPrototypeOf(this) === Object.getPrototypeOf(other) &&
      this.value === other.getValue()
    );
  }
}
