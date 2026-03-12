export class CreateMaterialCommand {
  constructor(
    public readonly name: string,
    public readonly unit: string,
    public readonly createdBy: string,
    public readonly description?: string,
    public readonly minStock?: number,
    public readonly unitPrice?: number,
    public readonly categoryId?: string,
    public readonly supplierId?: string,
  ) {}
}
