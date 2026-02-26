export class RemoveJobItemCommand {
  constructor(
    public readonly jobId: string,
    public readonly itemId: string,
    public readonly userId: string,
  ) {}
}
