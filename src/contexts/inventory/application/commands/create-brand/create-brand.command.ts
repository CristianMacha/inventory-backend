export class CreateBrandCommand {
  constructor(
    public readonly name: string,
    public readonly createdBy: string,
    public readonly description?: string,
  ) { }
}