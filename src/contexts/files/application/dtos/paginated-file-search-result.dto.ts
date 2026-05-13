import { ApiProperty } from '@nestjs/swagger';
import { FileRecordDto } from './file-record.dto';

export class PaginatedFileSearchResultDto {
  @ApiProperty({ type: [FileRecordDto] })
  data: FileRecordDto[];

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}
