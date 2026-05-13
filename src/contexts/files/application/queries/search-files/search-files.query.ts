export class SearchFilesQuery {
  constructor(
    public readonly organizationId: string,
    public readonly tags?: string[],
    public readonly name?: string,
    public readonly mimeType?: string,
    public readonly folderId?: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}
