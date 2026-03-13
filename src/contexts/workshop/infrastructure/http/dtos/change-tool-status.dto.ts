import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ToolStatus } from '../../../domain/enums/tool-status.enum';

export class ChangeToolStatusDto {
  @ApiProperty({ enum: ToolStatus })
  @IsEnum(ToolStatus)
  @IsNotEmpty()
  readonly newStatus: ToolStatus;

  @ApiPropertyOptional({ description: 'Associated job ID' })
  @IsUUID()
  @IsOptional()
  readonly jobId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly notes?: string;
}
