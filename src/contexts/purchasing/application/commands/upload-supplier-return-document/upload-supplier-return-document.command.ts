export class UploadSupplierReturnDocumentCommand {
  constructor(
    readonly returnId: string,
    readonly file: Express.Multer.File,
    readonly userId: string,
  ) {}
}
