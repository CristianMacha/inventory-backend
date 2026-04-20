export class SetPrimarySupplierCommand {
  constructor(
    public readonly productId: string,
    public readonly productSupplierId: string,
  ) {}
}
