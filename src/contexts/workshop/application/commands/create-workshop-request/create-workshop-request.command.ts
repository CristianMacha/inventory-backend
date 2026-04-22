import { RequestType } from '../../../domain/enums/request-type.enum';
import { RequestPriority } from '../../../domain/enums/request-priority.enum';

export class CreateWorkshopRequestCommand {
  constructor(
    public readonly requestType: RequestType,
    public readonly itemId: string,
    public readonly requestedBy: string,
    public readonly priority: RequestPriority,
    public readonly quantity?: number,
    public readonly jobId?: string,
    public readonly notes?: string,
  ) {}
}
