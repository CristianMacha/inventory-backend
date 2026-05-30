export class GetFileDownloadMetaQuery {
  constructor(
    public readonly fileId: string,
    public readonly organizationId: string,
  ) {}
}
