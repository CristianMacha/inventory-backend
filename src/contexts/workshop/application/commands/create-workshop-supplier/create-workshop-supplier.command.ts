export class CreateWorkshopSupplierCommand {
  constructor(
    public readonly name: string,
    public readonly phone?: string,
    public readonly email?: string,
    public readonly address?: string,
    public readonly notes?: string,
  ) {}
}
