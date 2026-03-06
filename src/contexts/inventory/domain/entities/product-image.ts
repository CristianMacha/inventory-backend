export class ProductImage {
  constructor(
    readonly id: string,
    readonly productId: string,
    readonly publicId: string,
    readonly isPrimary: boolean,
    readonly sortOrder: number,
  ) {}
}
