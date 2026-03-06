import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HttpStatus, Inject } from '@nestjs/common';
import { GetSupplierReturnDocumentUrlQuery } from './get-supplier-return-document-url.query';
import { ISupplierReturnRepository } from '@contexts/purchasing/domain/repositories/supplier-return.repository';
import { SupplierReturnId } from '@contexts/purchasing/domain/value-objects/supplier-return-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { DomainException } from '@shared/domain/domain.exception';
import { PURCHASING_TOKENS } from '@contexts/purchasing/application/purchasing.tokens';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';
import { FirebaseStorageService } from '@shared/storage/firebase/firebase-storage.service';

@QueryHandler(GetSupplierReturnDocumentUrlQuery)
export class GetSupplierReturnDocumentUrlHandler implements IQueryHandler<GetSupplierReturnDocumentUrlQuery> {
  constructor(
    @Inject(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY)
    private readonly supplierReturnRepository: ISupplierReturnRepository,
    @Inject(STORAGE_TOKENS.FIREBASE_STORAGE_SERVICE)
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  async execute(
    query: GetSupplierReturnDocumentUrlQuery,
  ): Promise<{ url: string }> {
    const supplierReturn = await this.supplierReturnRepository.findById(
      SupplierReturnId.create(query.returnId),
    );
    if (!supplierReturn) {
      throw new ResourceNotFoundException('SupplierReturn', query.returnId);
    }

    if (!supplierReturn.documentPath) {
      throw new DomainException(
        'This supplier return has no document attached',
        HttpStatus.NOT_FOUND,
      );
    }

    const url = await this.firebaseStorageService.getSignedUrl(
      supplierReturn.documentPath,
    );

    return { url };
  }
}
