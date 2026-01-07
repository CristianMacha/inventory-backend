import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProductDto {
  @ApiProperty({ example: 'Product name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Product brand id' })
  @IsUUID()
  @IsNotEmpty()
  readonly brandId: string;

  @ApiProperty({ example: 'Product category id' })
  @IsUUID()
  @IsNotEmpty()
  readonly categoryId: string;

  @ApiProperty({ example: 'Product description' })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
