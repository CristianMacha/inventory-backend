export class UpdateBrandCommand {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly isActive?: boolean,
  ) {}
}
