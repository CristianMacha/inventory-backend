import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetInvoiceDocumentUrlQuery } from './get-invoice-document-url.query';
import { IPurchaseInvoiceRepository } from '@contexts/purchasing/domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceId } from '@contexts/purchasing/domain/value-objects/purchase-invoice-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { DomainException } from '@shared/domain/domain.exception';
import { HttpStatus } from '@nestjs/common';
import { PURCHASING_TOKENS } from '@contexts/purchasing/application/purchasing.tokens';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';
import { FirebaseStorageService } from '@shared/storage/firebase/firebase-storage.service';

@QueryHandler(GetInvoiceDocumentUrlQuery)
export class GetInvoiceDocumentUrlHandler implements IQueryHandler<GetInvoiceDocumentUrlQuery> {
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
    @Inject(STORAGE_TOKENS.FIREBASE_STORAGE_SERVICE)
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  async execute(query: GetInvoiceDocumentUrlQuery): Promise<{ url: string }> {
    const invoice = await this.invoiceRepository.findById(
      PurchaseInvoiceId.create(query.invoiceId),
    );
    if (!invoice) {
      throw new ResourceNotFoundException('PurchaseInvoice', query.invoiceId);
    }

    if (!invoice.documentPath) {
      throw new DomainException(
        'This invoice has no document attached',
        HttpStatus.NOT_FOUND,
      );
    }

    const url = await this.firebaseStorageService.getSignedUrl(
      invoice.documentPath,
    );

    return { url };
  }
}
