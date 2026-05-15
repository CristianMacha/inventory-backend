import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class MoveFolderDto {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Target parent folder UUID. Send null to move to root.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  readonly targetParentId: string | null = null;
}
