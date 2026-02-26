export class CancelSupplierReturnCommand {
  constructor(
    public readonly returnId: string,
    public readonly userId: string,
  ) {}
}
