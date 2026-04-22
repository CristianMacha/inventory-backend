import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { RequestType } from '../../../domain/enums/request-type.enum';
import { RequestPriority } from '../../../domain/enums/request-priority.enum';

export class CreateWorkshopRequestDto {
  @ApiProperty({ enum: RequestType })
  @IsEnum(RequestType)
  readonly requestType: RequestType;

  @ApiProperty({ description: 'UUID of the tool or material' })
  @IsUUID()
  readonly itemId: string;

  @ApiPropertyOptional({
    description: 'Required for material requests',
    minimum: 0.001,
  })
  @IsNumber()
  @Min(0.001)
  @IsOptional()
  readonly quantity?: number;

  @ApiPropertyOptional({ description: 'Job this request is associated with' })
  @IsUUID()
  @IsOptional()
  readonly jobId?: string;

  @ApiPropertyOptional({
    enum: RequestPriority,
    default: RequestPriority.NORMAL,
  })
  @IsEnum(RequestPriority)
  @IsOptional()
  readonly priority?: RequestPriority;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly notes?: string;
}
