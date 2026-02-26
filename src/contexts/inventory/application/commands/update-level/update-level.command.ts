export class UpdateLevelCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly sortOrder?: number,
    public readonly description?: string,
    public readonly isActive?: boolean,
  ) {}
}
