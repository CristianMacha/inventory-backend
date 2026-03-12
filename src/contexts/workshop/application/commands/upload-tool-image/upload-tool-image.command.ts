export class UploadToolImageCommand {
  constructor(
    readonly toolId: string,
    readonly file: Express.Multer.File,
    readonly userId: string,
  ) {}
}
