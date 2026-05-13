export class MoveFileCommand {
  constructor(
    public readonly fileId: string,
    public readonly targetFolderId: string,
    public readonly organizationId: string,
  ) {}
}
