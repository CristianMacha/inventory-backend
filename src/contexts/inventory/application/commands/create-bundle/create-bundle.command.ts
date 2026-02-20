export class CreateBundleCommand {
  constructor(
    public readonly productId: string,
    public readonly supplierId: string,
    public readonly createdBy: string,
    public readonly lotNumber?: string,
    public readonly thicknessCm?: number,
  ) {}
}
