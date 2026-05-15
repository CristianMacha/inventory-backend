export class BulkMoveFilesCommand {
  constructor(
    public readonly fileIds: string[],
    public readonly targetFolderId: string,
    public readonly organizationId: string,
  ) {}
}
