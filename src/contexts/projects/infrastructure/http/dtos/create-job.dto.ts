import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: 'Kitchen Renovation - Smith Residence' })
  @IsString()
  @IsNotEmpty()
  readonly projectName: string;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  readonly clientName: string;

  @ApiPropertyOptional({ example: '+1-555-0100' })
  @IsString()
  @IsOptional()
  readonly clientPhone?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  readonly clientEmail?: string;

  @ApiPropertyOptional({ example: '123 Main St, City' })
  @IsString()
  @IsOptional()
  readonly clientAddress?: string;

  @ApiPropertyOptional({ example: 'Kitchen countertop installation' })
  @IsString()
  @IsOptional()
  readonly notes?: string;

  @ApiPropertyOptional({ example: '2026-03-15' })
  @IsDateString()
  @IsOptional()
  readonly scheduledDate?: string;
}
