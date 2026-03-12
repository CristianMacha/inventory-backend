export class CreateToolCommand {
  constructor(
    public readonly name: string,
    public readonly createdBy: string,
    public readonly description?: string,
    public readonly categoryId?: string,
    public readonly supplierId?: string,
    public readonly purchasePrice?: number,
  ) {}
}
