import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UploadInvoiceDocumentCommand } from './upload-invoice-document.command';
import { IPurchaseInvoiceRepository } from '@contexts/purchasing/domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceId } from '@contexts/purchasing/domain/value-objects/purchase-invoice-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '@contexts/purchasing/application/purchasing.tokens';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';
import { FirebaseStorageService } from '@shared/storage/firebase/firebase-storage.service';

@CommandHandler(UploadInvoiceDocumentCommand)
export class UploadInvoiceDocumentHandler implements ICommandHandler<UploadInvoiceDocumentCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
    @Inject(STORAGE_TOKENS.FIREBASE_STORAGE_SERVICE)
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  async execute(
    command: UploadInvoiceDocumentCommand,
  ): Promise<{ path: string }> {
    const invoice = await this.invoiceRepository.findById(
      PurchaseInvoiceId.create(command.invoiceId),
    );
    if (!invoice) {
      throw new ResourceNotFoundException('PurchaseInvoice', command.invoiceId);
    }

    if (invoice.documentPath) {
      await this.firebaseStorageService.delete(invoice.documentPath);
    }

    const { publicId: path } = await this.firebaseStorageService.upload(
      command.file,
      'invoices',
    );

    invoice.attachDocument(path, command.userId);
    await this.invoiceRepository.save(invoice);

    return { path };
  }
}
