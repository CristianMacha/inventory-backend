import { ApiProperty } from '@nestjs/swagger';
import { JobStatus } from '../../domain/enums/job-status.enum';

export class JobItemOutputDto {
  @ApiProperty({ example: 'uuid-item' })
  id: string;

  @ApiProperty({ example: 'uuid-slab' })
  slabId: string;

  @ApiProperty({ example: 'SLB-001' })
  slabCode: string;

  @ApiProperty({ example: 'Granito Blanco Polar' })
  productName: string;

  @ApiProperty({ example: 'Granito Blanco Polar - Slab SLB-001' })
  description: string;

  @ApiProperty({ example: 350.0 })
  unitPrice: number;

  @ApiProperty({ example: 350.0 })
  totalPrice: number;
}

export class JobOutputDto {
  @ApiProperty({ example: 'uuid-job' })
  id: string;

  @ApiProperty({ example: 'Kitchen Renovation - Smith Residence' })
  projectName: string;

  @ApiProperty({ example: 'John Smith' })
  clientName: string;

  @ApiProperty({ example: '+1-555-0100' })
  clientPhone: string;

  @ApiProperty({ example: 'john@example.com' })
  clientEmail: string;

  @ApiProperty({ example: '123 Main St, City' })
  clientAddress: string;

  @ApiProperty({ enum: JobStatus, example: JobStatus.QUOTED })
  status: JobStatus;

  @ApiProperty({ example: '2026-03-15', nullable: true })
  scheduledDate: string | null;

  @ApiProperty({ example: '2026-03-20T15:00:00.000Z', nullable: true })
  completedDate: string | null;

  @ApiProperty({ example: 'Kitchen countertop installation' })
  notes: string;

  @ApiProperty({ example: 2500.0 })
  subtotal: number;

  @ApiProperty({ example: 200.0 })
  taxAmount: number;

  @ApiProperty({ example: 2700.0 })
  totalAmount: number;

  @ApiProperty({ example: 'uuid-user' })
  createdBy: string;

  @ApiProperty({ example: 'uuid-user' })
  updatedBy: string;

  @ApiProperty({ example: '2026-01-15T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-01-15T00:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ example: 5 })
  itemCount: number;
}

export class JobDetailOutputDto extends JobOutputDto {
  @ApiProperty({ type: [JobItemOutputDto] })
  items: JobItemOutputDto[];
}
