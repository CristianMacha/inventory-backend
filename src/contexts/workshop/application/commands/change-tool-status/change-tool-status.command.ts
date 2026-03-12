import { ToolStatus } from '../../../domain/enums/tool-status.enum';

export class ChangeToolStatusCommand {
  constructor(
    public readonly toolId: string,
    public readonly newStatus: ToolStatus,
    public readonly updatedBy: string,
    public readonly jobId?: string,
    public readonly notes?: string,
  ) {}
}
