export class UploadInvoiceDocumentCommand {
  constructor(
    readonly invoiceId: string,
    readonly file: Express.Multer.File,
    readonly userId: string,
  ) {}
}
