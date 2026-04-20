export class RemoveProductSupplierCommand {
  constructor(
    public readonly productId: string,
    public readonly productSupplierId: string,
  ) {}
}
