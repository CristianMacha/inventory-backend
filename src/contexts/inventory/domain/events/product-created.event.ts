export class ProductCreatedEvent {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly brandId: string | null,
    public readonly categoryId: string,
    public readonly createdBy: string,
  ) {}
}
