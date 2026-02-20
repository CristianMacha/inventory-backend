import { ApiProperty } from '@nestjs/swagger';
import { IBundleOutputDto } from './bundle-output.dto';
import { ISlabOutputDto } from './slab-output.dto';

export class BundleWithSlabsOutputDto {
  @ApiProperty({ type: IBundleOutputDto })
  bundle: IBundleOutputDto;

  @ApiProperty({ type: [ISlabOutputDto] })
  slabs: ISlabOutputDto[];
}
