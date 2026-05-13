export class CreateFolderCommand {
  constructor(
    public readonly name: string,
    public readonly organizationId: string,
    public readonly createdByUserId: string,
    public readonly parentId: string | null = null,
  ) {}
}
