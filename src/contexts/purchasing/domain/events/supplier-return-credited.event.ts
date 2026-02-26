export class SupplierReturnCreditedEvent {
  constructor(
    public readonly returnId: string,
    public readonly slabIds: string[],
  ) {}
}
