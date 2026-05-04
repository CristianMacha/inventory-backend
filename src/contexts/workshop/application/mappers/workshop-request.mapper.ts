import { WorkshopRequest } from '../../domain/entities/workshop-request.entity';
import { WorkshopRequestDto } from '../dtos/workshop-request.dto';

export class WorkshopRequestMapper {
  static toDto(
    request: WorkshopRequest,
    userNames: Map<string, string>,
  ): WorkshopRequestDto {
    const dto = new WorkshopRequestDto();
    dto.id = request.id.getValue();
    dto.requestType = request.requestType;
    dto.itemId = request.itemId;
    dto.quantity = request.quantity;
    dto.jobId = request.jobId;
    dto.priority = request.priority;
    dto.notes = request.notes;
    dto.status = request.status;
    dto.requestedBy = request.requestedBy;
    dto.requestedByName =
      userNames.get(request.requestedBy) ?? request.requestedBy;
    dto.resolvedBy = request.resolvedBy;
    dto.resolvedByName = request.resolvedBy
      ? (userNames.get(request.resolvedBy) ?? request.resolvedBy)
      : null;
    dto.resolvedAt = request.resolvedAt?.toISOString() ?? null;
    dto.rejectionReason = request.rejectionReason;
    dto.createdAt = request.createdAt.toISOString();
    dto.updatedAt = request.updatedAt.toISOString();
    return dto;
  }
}
