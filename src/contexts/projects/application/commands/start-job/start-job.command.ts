export class StartJobCommand {
  constructor(
    public readonly jobId: string,
    public readonly userId: string,
  ) {}
}
