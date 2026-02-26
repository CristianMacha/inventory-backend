export class CreatePurchaseInvoiceCommand {
  constructor(
    public readonly invoiceNumber: string,
    public readonly supplierId: string,
    public readonly invoiceDate: Date,
    public readonly createdBy: string,
    public readonly dueDate?: Date | null,
    public readonly notes?: string,
  ) {}
}
