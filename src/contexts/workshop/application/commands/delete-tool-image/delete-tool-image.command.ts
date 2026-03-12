export class DeleteToolImageCommand {
  constructor(
    readonly toolId: string,
    readonly userId: string,
  ) {}
}
