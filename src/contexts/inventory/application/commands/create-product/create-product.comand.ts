export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly createdBy: string,
    public readonly brandId: string,
    public readonly categoryId: string,
    public readonly description?: string,
  ) { }
}