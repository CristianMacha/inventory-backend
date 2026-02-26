export class JobCancelledEvent {
  constructor(
    public readonly jobId: string,
    public readonly slabIds: string[],
  ) {}
}
