export class UpdateCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly name?: string,
    public readonly description?: string,
  ) {}
}
