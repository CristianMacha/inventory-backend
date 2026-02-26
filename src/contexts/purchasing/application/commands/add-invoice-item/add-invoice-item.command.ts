import { InvoiceItemConcept } from '../../../domain/enums/invoice-item-concept.enum';

export class AddInvoiceItemCommand {
  constructor(
    public readonly invoiceId: string,
    public readonly bundleId: string,
    public readonly concept: InvoiceItemConcept,
    public readonly description: string,
    public readonly unitCost: number,
    public readonly quantity: number,
    public readonly userId: string,
  ) {}
}
