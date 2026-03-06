export class UploadBundleImageCommand {
  constructor(
    readonly bundleId: string,
    readonly file: Express.Multer.File,
    readonly userId: string,
  ) {}
}
