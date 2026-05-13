export class UploadFileCommand {
  constructor(
    public readonly file: Express.Multer.File,
    public readonly folderId: string,
    public readonly organizationId: string,
    public readonly uploadedByUserId: string,
  ) {}
}
