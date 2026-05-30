import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RenameFileDto {
  @ApiProperty({ example: 'contrato-final-2024.pdf' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;
}
