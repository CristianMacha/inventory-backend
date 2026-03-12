export class UpdateMaterialCommand {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly name?: string,
    public readonly description?: string | null,
    public readonly unit?: string,
    public readonly minStock?: number,
    public readonly unitPrice?: number | null,
    public readonly categoryId?: string | null,
    public readonly supplierId?: string | null,
  ) {}
}
