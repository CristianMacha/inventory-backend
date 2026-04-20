export class AddProductSupplierCommand {
  constructor(
    public readonly productId: string,
    public readonly supplierId: string,
    public readonly isPrimary: boolean,
  ) {}
}
