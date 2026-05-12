export class DeliverWorkshopRequestCommand {
  constructor(
    public readonly requestId: string,
    public readonly deliveredBy: string,
  ) {}
}
