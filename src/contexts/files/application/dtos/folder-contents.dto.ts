import { ApiProperty } from '@nestjs/swagger';
import { FolderDto } from './folder.dto';
import { FileRecordDto } from './file-record.dto';

export class PaginatedFileRecordsDto {
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

export class FolderContentsDto {
  @ApiProperty({ type: FolderDto })
  folder: FolderDto;

  @ApiProperty({ type: [FolderDto] })
  subfolders: FolderDto[];

  @ApiProperty({ type: PaginatedFileRecordsDto })
  files: PaginatedFileRecordsDto;
}
