import { Job } from '../../domain/entities/job';
import { JobItemDetails } from '../../domain/repositories/job.repository';
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
      paidAmount: job.paidAmount,
      createdBy: job.createdBy,
      updatedBy: job.updatedBy,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      itemCount: job.itemCount,
    };
  }

  static toDetailResponse(
    job: Job,
    itemDetails: JobItemDetails[],
  ): JobDetailOutputDto {
    return {
      ...JobResponseMapper.toResponse(job),
      items: itemDetails.map((item) =>
        JobResponseMapper.itemDetailsToResponse(item),
      ),
    };
  }

  static itemDetailsToResponse(item: JobItemDetails): JobItemOutputDto {
    return {
      id: item.id,
      slabId: item.slabId,
      slabCode: item.slabCode,
      productName: item.productName,
      description: item.description,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    };
  }
}
