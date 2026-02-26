export class CompleteJobCommand {
  constructor(
    public readonly jobId: string,
    public readonly userId: string,
  ) {}
}
