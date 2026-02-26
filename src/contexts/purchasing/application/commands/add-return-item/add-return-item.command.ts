import { ReturnReason } from '../../../domain/enums/return-reason.enum';

export class AddReturnItemCommand {
  constructor(
    public readonly returnId: string,
    public readonly slabId: string,
    public readonly bundleId: string,
    public readonly reason: ReturnReason,
    public readonly description: string,
    public readonly unitCost: number,
    public readonly userId: string,
  ) {}
}
