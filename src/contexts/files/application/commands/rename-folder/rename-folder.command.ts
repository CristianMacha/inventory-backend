export class RenameFolderCommand {
  constructor(
    public readonly folderId: string,
    public readonly name: string,
    public readonly organizationId: string,
  ) {}
}
