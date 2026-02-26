export class CreateJobCommand {
  constructor(
    public readonly projectName: string,
    public readonly clientName: string,
    public readonly createdBy: string,
    public readonly clientPhone?: string,
    public readonly clientEmail?: string,
    public readonly clientAddress?: string,
    public readonly notes?: string,
    public readonly scheduledDate?: Date | null,
  ) {}
}
