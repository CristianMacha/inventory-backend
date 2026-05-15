export class GetFolderQuery {
  constructor(
    public readonly folderId: string,
    public readonly organizationId: string,
  ) {}
}
