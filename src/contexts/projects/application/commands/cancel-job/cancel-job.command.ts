export class CancelJobCommand {
  constructor(
    public readonly jobId: string,
    public readonly userId: string,
  ) {}
}
