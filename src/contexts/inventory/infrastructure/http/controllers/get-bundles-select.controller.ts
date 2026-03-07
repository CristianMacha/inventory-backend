import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiPropertyOptional,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

import { GetBundlesSelectQuery } from '../../../application/queries/get-bundles-select/get-bundles-select.query';
import { IBundleOutputDto } from '../../../application/dtos/bundle-output.dto';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';

class GetBundlesSelectQueryDto {
  @ApiPropertyOptional({ description: 'Filter by supplier UUID' })
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @ApiPropertyOptional({ description: 'Only return bundles not linked to any invoice' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  unlinked?: boolean;
}

@ApiBearerAuth()
@ApiTags('Bundles')
@Controller('bundles')
export class GetBundlesSelectController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('select')
  @RequirePermissions(Permissions.BUNDLES.LIST)
  @ApiOperation({ summary: 'Get bundles for select/dropdown (no pagination)' })
  @ApiResponse({ status: 200, type: IBundleOutputDto, isArray: true })
  async run(@Query() query: GetBundlesSelectQueryDto): Promise<IBundleOutputDto[]> {
    return this.queryBus.execute(
      new GetBundlesSelectQuery(query.supplierId, query.unlinked),
    );
  }
}
