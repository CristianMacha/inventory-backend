import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({
    example: 10737418240,
    description: 'Storage limit in bytes (default 10 GB)',
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  readonly storageLimitBytes?: number;
}
