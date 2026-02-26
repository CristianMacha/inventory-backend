export class CreateFinishCommand {
  constructor(
    public readonly name: string,
    public readonly abbreviation?: string,
    public readonly description?: string,
  ) {}
}
