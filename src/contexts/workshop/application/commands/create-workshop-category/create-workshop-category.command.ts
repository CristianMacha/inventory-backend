export class CreateWorkshopCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly description?: string,
  ) {}
}
