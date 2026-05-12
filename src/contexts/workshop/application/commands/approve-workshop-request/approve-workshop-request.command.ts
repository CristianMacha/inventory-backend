export class ApproveWorkshopRequestCommand {
  constructor(
    public readonly requestId: string,
    public readonly resolvedBy: string,
    public readonly approvedQuantity?: number,
  ) {}
}
