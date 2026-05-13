export class GetFileUrlQuery {
  constructor(
    public readonly fileId: string,
    public readonly organizationId: string,
  ) {}
}
