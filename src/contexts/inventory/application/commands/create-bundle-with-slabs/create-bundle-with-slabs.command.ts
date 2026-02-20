export interface SlabInput {
  code: string;
  widthCm: number;
  heightCm: number;
  description?: string;
}

export class CreateBundleWithSlabsCommand {
  constructor(
    public readonly productId: string,
    public readonly supplierId: string,
    public readonly createdBy: string,
    public readonly slabs: SlabInput[],
    public readonly lotNumber?: string,
    public readonly thicknessCm?: number,
  ) {}
}
