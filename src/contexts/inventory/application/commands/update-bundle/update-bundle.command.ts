export class UpdateBundleCommand {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly lotNumber?: string,
    public readonly thicknessCm?: number,
  ) {}
}
