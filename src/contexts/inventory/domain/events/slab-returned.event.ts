export class SlabReturnedEvent {
  constructor(
    public readonly slabId: string,
    public readonly bundleId: string,
    public readonly returnedBy: string,
  ) {}
}
