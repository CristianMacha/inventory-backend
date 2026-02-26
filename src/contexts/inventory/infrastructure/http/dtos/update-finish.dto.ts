import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateFinishDto {
  @ApiPropertyOptional({ example: 'Pulido' })
  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ example: 'PL' })
  @IsString()
  @IsOptional()
  readonly abbreviation?: string;

  @ApiPropertyOptional({ example: 'Superficie pulida a espejo' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}
