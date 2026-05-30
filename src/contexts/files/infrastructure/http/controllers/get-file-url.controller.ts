import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { OrgAccessGuard } from '@contexts/files/infrastructure/guards/org-access.guard';
import { GetFileUrlQuery } from '@contexts/files/application/queries/get-file-url/get-file-url.query';

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files')
export class GetFileUrlController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':fileId/url')
  @RequirePermissions(Permissions.FILES.READ)
  @ApiOperation({
    summary: 'Get signed download URL',
    description:
      'Generates a temporary signed URL to download the file directly from Firebase Storage. The URL expires after 1 hour.',
  })
  @ApiParam({
    name: 'fileId',
    description: 'File UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID that owns the file',
  })
  @ApiResponse({
    status: 200,
    description: 'Signed URL generated.',
    schema: { example: { url: 'https://storage.googleapis.com/...' } },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Requires files.read permission. Also returns 403 if the organizationId does not belong to the authenticated user.',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found or does not belong to this organization.',
  })
  async run(
    @Param('fileId', new ParseUUIDPipe()) fileId: string,
    @Query('organizationId') organizationId: string,
  ): Promise<{ url: string }> {
    return this.queryBus.execute(new GetFileUrlQuery(fileId, organizationId));
  }
}
