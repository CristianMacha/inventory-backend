import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MoveFileDto {
  @ApiProperty({ example: 'uuid-of-target-folder' })
  @IsUUID()
  @IsNotEmpty()
  readonly targetFolderId: string;
}
