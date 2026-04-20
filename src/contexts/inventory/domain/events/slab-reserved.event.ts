export class SlabReservedEvent {
  constructor(
    public readonly slabId: string,
    public readonly bundleId: string,
    public readonly reservedBy: string,
  ) {}
}
