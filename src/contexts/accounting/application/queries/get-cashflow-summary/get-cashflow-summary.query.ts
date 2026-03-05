export class GetCashflowSummaryQuery {
  constructor(
    public readonly fromDate?: Date,
    public readonly toDate?: Date,
  ) {}
}
