export class UpdateSupplierCommand {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly name?: string,
    public readonly abbreviation?: string,
    public readonly isActive?: boolean,
  ) {}
}
