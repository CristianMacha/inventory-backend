export class SlabCreatedEvent {
  constructor(
    public readonly slabId: string,
    public readonly productId: string,
    public readonly serialNumber: string,
    public readonly createdBy: string,
  ) {}
}
