import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkshopSupplierDto {
  @ApiProperty({ example: 'Ferretería Central' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({ example: '+1-555-0100' })
  @IsString()
  @IsOptional()
  readonly phone?: string;

  @ApiPropertyOptional({ example: 'contacto@ferreteria.com' })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly notes?: string;
}
