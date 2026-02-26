export class JobApprovedEvent {
  constructor(
    public readonly jobId: string,
    public readonly slabIds: string[],
  ) {}
}
