import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RenameFolderDto {
  @ApiProperty({ example: 'New Folder Name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly name: string;
}
