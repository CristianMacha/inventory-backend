export class CreateSupplierReturnCommand {
  constructor(
    public readonly purchaseInvoiceId: string,
    public readonly supplierId: string,
    public readonly returnDate: Date,
    public readonly notes: string,
    public readonly createdBy: string,
  ) {}
}
