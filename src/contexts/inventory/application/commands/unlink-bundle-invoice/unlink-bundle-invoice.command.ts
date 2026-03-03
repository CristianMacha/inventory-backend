export class UnlinkBundleInvoiceCommand {
  constructor(
    public readonly bundleId: string,
    public readonly updatedBy: string,
  ) {}
}
