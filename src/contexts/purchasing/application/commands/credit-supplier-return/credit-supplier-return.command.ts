export class CreditSupplierReturnCommand {
  constructor(
    public readonly returnId: string,
    public readonly userId: string,
  ) {}
}
