export class UpdateJobCommand {
  constructor(
    public readonly jobId: string,
    public readonly userId: string,
    public readonly projectName?: string,
    public readonly clientName?: string,
    public readonly clientPhone?: string,
    public readonly clientEmail?: string,
    public readonly clientAddress?: string,
    public readonly notes?: string,
    public readonly scheduledDate?: Date | null,
    public readonly taxAmount?: number,
  ) {}
}
