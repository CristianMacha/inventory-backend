export class SendSupplierReturnCommand {
  constructor(
    public readonly returnId: string,
    public readonly userId: string,
  ) {}
}
