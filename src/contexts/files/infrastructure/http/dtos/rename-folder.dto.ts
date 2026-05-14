import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RenameFolderDto {
  @ApiProperty({ example: 'New Folder Name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
