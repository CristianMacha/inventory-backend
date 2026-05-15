export class MoveFolderCommand {
  constructor(
    public readonly folderId: string,
    public readonly targetParentId: string | null,
    public readonly organizationId: string,
  ) {}
}
