export class RemoveReturnItemCommand {
  constructor(
    public readonly returnId: string,
    public readonly itemId: string,
    public readonly userId: string,
  ) {}
}
