export class CreateOrganizationCommand {
  constructor(
    public readonly name: string,
    public readonly createdBy: string,
    public readonly storageLimitBytes?: number,
  ) {}
}
