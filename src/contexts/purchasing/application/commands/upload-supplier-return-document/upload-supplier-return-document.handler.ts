import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UploadSupplierReturnDocumentCommand } from './upload-supplier-return-document.command';
import { ISupplierReturnRepository } from '@contexts/purchasing/domain/repositories/supplier-return.repository';
import { SupplierReturnId } from '@contexts/purchasing/domain/value-objects/supplier-return-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '@contexts/purchasing/application/purchasing.tokens';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';
import { FirebaseStorageService } from '@shared/storage/firebase/firebase-storage.service';

@CommandHandler(UploadSupplierReturnDocumentCommand)
export class UploadSupplierReturnDocumentHandler implements ICommandHandler<UploadSupplierReturnDocumentCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY)
    private readonly supplierReturnRepository: ISupplierReturnRepository,
    @Inject(STORAGE_TOKENS.FIREBASE_STORAGE_SERVICE)
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  async execute(
    command: UploadSupplierReturnDocumentCommand,
  ): Promise<{ path: string }> {
    const supplierReturn = await this.supplierReturnRepository.findById(
      SupplierReturnId.create(command.returnId),
    );
    if (!supplierReturn) {
      throw new ResourceNotFoundException('SupplierReturn', command.returnId);
    }

    if (supplierReturn.documentPath) {
      await this.firebaseStorageService.delete(supplierReturn.documentPath);
    }

    const { publicId: path } = await this.firebaseStorageService.upload(
      command.file,
      'supplier-returns',
    );

    supplierReturn.attachDocument(path, command.userId);
    await this.supplierReturnRepository.save(supplierReturn);

    return { path };
  }
}
