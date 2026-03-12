export class UploadMaterialImageCommand {
  constructor(
    readonly materialId: string,
    readonly file: Express.Multer.File,
    readonly userId: string,
  ) {}
}
