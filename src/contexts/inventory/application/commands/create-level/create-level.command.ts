export class CreateLevelCommand {
  constructor(
    public readonly name: string,
    public readonly sortOrder?: number,
    public readonly description?: string,
  ) {}
}
