export class AddTagsCommand {
  constructor(
    public readonly fileId: string,
    public readonly organizationId: string,
    public readonly tags: string[],
  ) {}
}
