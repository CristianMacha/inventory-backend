export class LinkBundleInvoiceCommand {
  constructor(
    public readonly bundleId: string,
    public readonly purchaseInvoiceId: string,
    public readonly updatedBy: string,
  ) {}
}
