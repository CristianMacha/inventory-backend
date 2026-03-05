export class CreateRemnantSlabCommand {
  constructor(
    public readonly parentSlabId: string,
    public readonly code: string,
    public readonly widthCm: number,
    public readonly heightCm: number,
    public readonly userId: string,
    public readonly description?: string,
  ) {}
}
