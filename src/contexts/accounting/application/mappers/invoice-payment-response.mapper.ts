import { InvoicePayment } from '../../domain/entities/invoice-payment';
import { InvoicePaymentOutputDto } from '../dtos/invoice-payment-output.dto';

export class InvoicePaymentResponseMapper {
  static toResponse(payment: InvoicePayment): InvoicePaymentOutputDto {
    return {
      id: payment.id.getValue(),
      invoiceId: payment.invoiceId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate.toISOString().split('T')[0],
      reference: payment.reference,
      createdBy: payment.createdBy,
      createdAt: payment.createdAt.toISOString(),
    };
  }
}
