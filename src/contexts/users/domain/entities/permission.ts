export class Permission {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly description?: string,
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string | undefined {
    return this.description;
  }
}
