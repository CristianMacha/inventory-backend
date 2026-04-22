import { WorkshopRequest } from '../../domain/entities/workshop-request.entity';
import { WorkshopRequestDto } from '../dtos/workshop-request.dto';

export class WorkshopRequestMapper {
  static toDto(request: WorkshopRequest): WorkshopRequestDto {
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
    dto.resolvedBy = request.resolvedBy;
    dto.resolvedAt = request.resolvedAt?.toISOString() ?? null;
    dto.rejectionReason = request.rejectionReason;
    dto.createdAt = request.createdAt.toISOString();
    dto.updatedAt = request.updatedAt.toISOString();
    return dto;
  }
}
