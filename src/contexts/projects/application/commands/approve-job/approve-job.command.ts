export class ApproveJobCommand {
  constructor(
    public readonly jobId: string,
    public readonly userId: string,
  ) {}
}
