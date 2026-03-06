export class UploadProductImageCommand {
  constructor(
    readonly productId: string,
    readonly file: Express.Multer.File,
    readonly userId: string,
  ) {}
}
