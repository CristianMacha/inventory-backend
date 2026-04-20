export class SlabSoldEvent {
  constructor(
    public readonly slabId: string,
    public readonly bundleId: string,
    public readonly soldBy: string,
  ) {}
}
