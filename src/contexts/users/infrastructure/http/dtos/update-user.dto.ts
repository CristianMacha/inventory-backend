import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly roleNames?: string[];

  @ApiPropertyOptional({
    description:
      'Organization UUID to assign to this user. Send null to unassign.',
    example: '086871eb-feac-47f7-bce0-debe4fca64b6',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  readonly organizationId?: string | null;
}
