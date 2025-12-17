export class RefreshToken {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly tokenHash: string,
    private isRevoked: boolean,
    private readonly expiresAt: Date,
    private readonly createdAt: Date,
  ) {}

  static create(
    id: string,
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): RefreshToken {
    return new RefreshToken(
      id,
      userId,
      tokenHash,
      false,
      expiresAt,
      new Date(),
    );
  }

  public revoke(): void {
    this.isRevoked = true;
  }

  public isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }

  private isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getTokenHash(): string {
    return this.tokenHash;
  }

  public getIsRevoked(): boolean {
    return this.isRevoked;
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
