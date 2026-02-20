export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly createdBy: string,
    public readonly categoryId: string,
    public readonly levelId: string,
    public readonly finishId: string,
    public readonly description?: string,
    public readonly brandId?: string,
  ) {}
}
