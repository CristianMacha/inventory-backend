import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFinishDto {
  @ApiProperty({ example: 'Pulido' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({ example: 'PL' })
  @IsString()
  @IsOptional()
  readonly abbreviation?: string;

  @ApiPropertyOptional({ example: 'Superficie pulida a espejo' })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
