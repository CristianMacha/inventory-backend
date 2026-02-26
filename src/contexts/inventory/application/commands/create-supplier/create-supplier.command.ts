export class CreateSupplierCommand {
  constructor(
    public readonly name: string,
    public readonly createdBy: string,
    public readonly abbreviation?: string,
  ) {}
}
