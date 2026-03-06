export class DeleteProductImageCommand {
  constructor(
    readonly imageId: string,
    readonly userId: string,
  ) {}
}
