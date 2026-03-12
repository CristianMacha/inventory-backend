export class DeleteMaterialImageCommand {
  constructor(
    readonly materialId: string,
    readonly userId: string,
  ) {}
}
