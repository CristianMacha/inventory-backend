import { Job } from '../../domain/entities/job';
import { JobItem } from '../../domain/entities/job-item';
import {
  JobOutputDto,
  JobDetailOutputDto,
  JobItemOutputDto,
} from '../dtos/job-output.dto';

export class JobResponseMapper {
  static toResponse(job: Job): JobOutputDto {
    return {
      id: job.id.getValue(),
      projectName: job.projectName,
      clientName: job.clientName,
      clientPhone: job.clientPhone,
      clientEmail: job.clientEmail,
      clientAddress: job.clientAddress,
      status: job.status,
      scheduledDate: job.scheduledDate
        ? job.scheduledDate.toISOString().split('T')[0]
        : null,
      completedDate: job.completedDate ? job.completedDate.toISOString() : null,
      notes: job.notes,
      subtotal: job.subtotal,
      taxAmount: job.taxAmount,
      totalAmount: job.totalAmount,
      createdBy: job.createdBy,
      updatedBy: job.updatedBy,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      itemCount: job.items.length,
    };
  }

  static toDetailResponse(job: Job): JobDetailOutputDto {
    return {
      ...JobResponseMapper.toResponse(job),
      items: job.items.map((item) => JobResponseMapper.itemToResponse(item)),
    };
  }

  static itemToResponse(item: JobItem): JobItemOutputDto {
    return {
      id: item.id.getValue(),
      slabId: item.slabId,
      description: item.description,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    };
  }
}
