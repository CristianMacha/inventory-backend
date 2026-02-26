export class GetReturnableSlabsQuery {
  constructor(
    public readonly purchaseInvoiceId: string,
    public readonly bundleId?: string,
  ) {}
}
