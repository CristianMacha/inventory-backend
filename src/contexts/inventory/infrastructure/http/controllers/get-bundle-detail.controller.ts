import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetBundleDetailQuery } from '../../../application/queries/get-bundle-detail/get-bundle-detail.query';
import { BundleDetailOutputDto } from '../../../application/dtos/bundle-detail-output.dto';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Bundles')
@Controller('bundles')
export class GetBundleDetailController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':id')
  @RequirePermissions(Permissions.BUNDLES.READ)
  @ApiOperation({ summary: 'Get bundle detail with all slabs' })
  @ApiParam({ name: 'id', description: 'Bundle UUID' })
  @ApiResponse({ status: 200, type: BundleDetailOutputDto })
  @ApiResponse({ status: 404, description: 'Bundle not found' })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BundleDetailOutputDto> {
    return this.queryBus.execute(new GetBundleDetailQuery(id));
  }
}
