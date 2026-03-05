export class JobPaymentRecordedEvent {
  constructor(
    public readonly jobId: string,
    public readonly paymentAmount: number,
    public readonly userId: string,
  ) {}
}
