import { ApiProperty } from '@nestjs/swagger';

export class CashflowSummaryDto {
  @ApiProperty({ example: 5000.0 })
  totalIngress: number;

  @ApiProperty({ example: 3000.0 })
  totalEgress: number;

  @ApiProperty({ example: 2000.0 })
  cashBalance: number;

  @ApiProperty({ example: 4000.0 })
  jobIncome: number;

  @ApiProperty({ example: 1000.0 })
  generalIncome: number;

  @ApiProperty({ example: 2500.0 })
  invoiceExpenses: number;

  @ApiProperty({ example: 500.0 })
  generalExpenses: number;

  @ApiProperty({ example: '2026-01-01', nullable: true })
  fromDate: string | null;

  @ApiProperty({ example: '2026-03-31', nullable: true })
  toDate: string | null;
}
