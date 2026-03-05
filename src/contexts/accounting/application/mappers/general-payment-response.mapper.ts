import { GeneralPayment } from '../../domain/entities/general-payment';
import { GeneralPaymentOutputDto } from '../dtos/general-payment-output.dto';

export class GeneralPaymentResponseMapper {
  static toResponse(payment: GeneralPayment): GeneralPaymentOutputDto {
    return {
      id: payment.id.getValue(),
      type: payment.type,
      category: payment.category,
      description: payment.description,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate.toISOString().split('T')[0],
      reference: payment.reference,
      createdBy: payment.createdBy,
      createdAt: payment.createdAt.toISOString(),
    };
  }
}
