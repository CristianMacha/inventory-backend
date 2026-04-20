export interface SlabInput {
  code: string;
  widthCm: number;
  heightCm: number;
  description?: string;
}

export class BulkCreateSlabsCommand {
  constructor(
    public readonly bundleId: string,
    public readonly slabs: SlabInput[],
    public readonly createdBy: string,
  ) {}
}
