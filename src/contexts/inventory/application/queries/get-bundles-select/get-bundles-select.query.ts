export class GetBundlesSelectQuery {
  constructor(
    public readonly supplierId?: string,
    public readonly unlinked?: boolean,
  ) {}
}
