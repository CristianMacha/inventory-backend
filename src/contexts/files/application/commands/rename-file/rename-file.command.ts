export class RenameFileCommand {
  constructor(
    public readonly fileId: string,
    public readonly name: string,
    public readonly organizationId: string,
  ) {}
}
