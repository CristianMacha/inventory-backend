export class CreateSlabCommand {
  constructor(
    public readonly bundleId: string,
    public readonly code: string,
    public readonly widthCm: number,
    public readonly heightCm: number,
    public readonly createdBy: string,
    public readonly description?: string,
  ) {}
}
