import { JobPayment } from '../../domain/entities/job-payment';
import { JobPaymentOutputDto } from '../dtos/job-payment-output.dto';

export class JobPaymentResponseMapper {
  static toResponse(payment: JobPayment): JobPaymentOutputDto {
    return {
      id: payment.id.getValue(),
      jobId: payment.jobId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate.toISOString().split('T')[0],
      reference: payment.reference,
      createdBy: payment.createdBy,
      createdAt: payment.createdAt.toISOString(),
    };
  }
}
