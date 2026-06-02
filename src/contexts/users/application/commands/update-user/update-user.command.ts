export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly currentUserId: string,
    public readonly name?: string,
    public readonly roleNames?: string[],
    public readonly organizationId?: string | null,
  ) {}
}
