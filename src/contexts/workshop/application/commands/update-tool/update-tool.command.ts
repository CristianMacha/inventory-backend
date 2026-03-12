import { ToolStatus } from '../../../domain/enums/tool-status.enum';

export class UpdateToolCommand {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly name?: string,
    public readonly description?: string | null,
    public readonly status?: ToolStatus,
    public readonly categoryId?: string | null,
    public readonly supplierId?: string | null,
    public readonly purchasePrice?: number | null,
  ) {}
}
