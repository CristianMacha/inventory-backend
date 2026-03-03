import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateJobDto {
  @ApiPropertyOptional({ example: 'Kitchen Renovation - Smith Residence' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly projectName?: string;

  @ApiPropertyOptional({ example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly clientName?: string;

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

  @ApiPropertyOptional({ example: '2026-03-15', nullable: true })
  @IsDateString()
  @IsOptional()
  readonly scheduledDate?: string | null;

  @ApiPropertyOptional({ example: 200.0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly taxAmount?: number;
}
