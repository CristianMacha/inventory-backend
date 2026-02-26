export class AddJobItemCommand {
  constructor(
    public readonly jobId: string,
    public readonly slabId: string,
    public readonly description: string,
    public readonly unitPrice: number,
    public readonly userId: string,
  ) {}
}
