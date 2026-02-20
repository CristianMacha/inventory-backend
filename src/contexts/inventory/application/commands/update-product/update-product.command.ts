export class UpdateProductCommand {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly brandId?: string | null,
    public readonly categoryId?: string,
    public readonly levelId?: string,
    public readonly finishId?: string,
    public readonly isActive?: boolean,
  ) {}
}
