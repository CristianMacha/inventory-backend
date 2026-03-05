import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { PaymentMethod } from '../../../domain/enums/payment-method.enum';

export class RecordJobPaymentDto {
  @ApiProperty({ example: 'uuid-job' })
  @IsUUID()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty({ example: 1200.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.BANK_TRANSFER })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: '2026-03-03' })
  @IsISO8601({ strict: true })
  paymentDate: string;

  @ApiProperty({ example: 'TRF-002', required: false, nullable: true })
  @IsOptional()
  @IsString()
  reference?: string | null;
}
