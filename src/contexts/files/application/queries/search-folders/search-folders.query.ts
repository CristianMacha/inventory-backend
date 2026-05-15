export class SearchFoldersQuery {
  constructor(
    public readonly organizationId: string,
    public readonly name: string,
  ) {}
}
