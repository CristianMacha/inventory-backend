import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RenameFileDto {
  @ApiProperty({ example: 'contrato-final-2024.pdf' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
