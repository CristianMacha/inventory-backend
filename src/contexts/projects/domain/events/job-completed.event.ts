export class JobCompletedEvent {
  constructor(
    public readonly jobId: string,
    public readonly slabIds: string[],
  ) {}
}
