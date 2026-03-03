export interface BulkJobItemInput {
  slabId: string;
  unitPrice: number;
  description?: string;
}

export class AddBulkJobItemsCommand {
  constructor(
    public readonly jobId: string,
    public readonly items: BulkJobItemInput[],
    public readonly userId: string,
  ) {}
}
