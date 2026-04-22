export class RejectWorkshopRequestCommand {
  constructor(
    public readonly requestId: string,
    public readonly resolvedBy: string,
    public readonly rejectionReason?: string,
  ) {}
}
