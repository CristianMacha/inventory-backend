import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { normalizePaginationParams } from '@shared/domain/pagination/pagination-params.interface';

import { CreateToolCommand } from '../../../application/commands/create-tool/create-tool.command';
import { UpdateToolCommand } from '../../../application/commands/update-tool/update-tool.command';
import { DeleteToolCommand } from '../../../application/commands/delete-tool/delete-tool.command';
import { ChangeToolStatusCommand } from '../../../application/commands/change-tool-status/change-tool-status.command';
import { GetToolsQuery } from '../../../application/queries/get-tools/get-tools.query';
import { GetToolByIdQuery } from '../../../application/queries/get-tool-by-id/get-tool-by-id.query';
import { GetToolMovementsQuery } from '../../../application/queries/get-tool-movements/get-tool-movements.query';
import { CreateToolDto } from '../dtos/create-tool.dto';
import { UpdateToolDto } from '../dtos/update-tool.dto';
import { ChangeToolStatusDto } from '../dtos/change-tool-status.dto';
import { ToolDto } from '../../../application/dtos/tool.dto';
import { ToolMovementDto } from '../../../application/dtos/tool-movement.dto';
import { UploadToolImageCommand } from '../../../application/commands/upload-tool-image/upload-tool-image.command';
import { DeleteToolImageCommand } from '../../../application/commands/delete-tool-image/delete-tool-image.command';
import { FileValidationPipe } from '@shared/storage/pipes/file-validation.pipe';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_10MB = 10 * 1024 * 1024;

@ApiBearerAuth()
@ApiTags('Workshop - Tools')
@Controller('workshop/tools')
export class ToolsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(Permissions.WORKSHOP_TOOLS.CREATE)
  @ApiOperation({ summary: 'Create a new tool' })
  @ApiResponse({ status: 201, description: 'Tool created successfully' })
  @ApiResponse({ status: 409, description: 'Tool name already exists' })
  async create(
    @Body() dto: CreateToolDto,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new CreateToolCommand(
        dto.name,
        user.id,
        dto.description,
        dto.categoryId,
        dto.supplierId,
        dto.purchasePrice,
      ),
    );
  }

  @Get()
  @RequirePermissions(Permissions.WORKSHOP_TOOLS.LIST)
  @ApiOperation({ summary: 'Get paginated list of tools' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: ToolDto, isArray: true })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.queryBus.execute(
      new GetToolsQuery(normalizePaginationParams(page, limit)),
    );
  }

  @Get(':id')
  @RequirePermissions(Permissions.WORKSHOP_TOOLS.READ)
  @ApiOperation({ summary: 'Get tool by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ToolDto })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ToolDto> {
    return this.queryBus.execute(new GetToolByIdQuery(id));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_TOOLS.UPDATE)
  @ApiOperation({ summary: 'Update a tool' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Tool updated successfully' })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateToolDto,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateToolCommand(
        id,
        user.id,
        dto.name,
        dto.description,
        dto.status,
        dto.categoryId,
        dto.supplierId,
        dto.purchasePrice,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permissions.WORKSHOP_TOOLS.DELETE)
  @ApiOperation({ summary: 'Delete a tool' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Tool deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commandBus.execute(new DeleteToolCommand(id));
  }

  @Post(':id/image')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_TOOLS.UPDATE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image (JPEG, PNG, WebP — max 10MB)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload or replace the tool image' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  async uploadImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile(
      new FileValidationPipe({
        allowedMimeTypes: IMAGE_MIME_TYPES,
        maxSizeBytes: MAX_10MB,
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: AuthUserDto,
  ) {
    return this.commandBus.execute(
      new UploadToolImageCommand(id, file, user.id),
    );
  }

  @Delete(':id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permissions.WORKSHOP_TOOLS.UPDATE)
  @ApiOperation({ summary: 'Delete the tool image' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  async deleteImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteToolImageCommand(id, user.id));
  }

  @Post(':id/status')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_MOVEMENTS.CREATE)
  @ApiOperation({ summary: 'Change tool status and record movement' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Status changed and movement recorded',
  })
  @ApiResponse({ status: 404, description: 'Tool not found' })
  async changeStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ChangeToolStatusDto,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new ChangeToolStatusCommand(
        id,
        dto.newStatus,
        user.id,
        dto.jobId,
        dto.notes,
      ),
    );
  }

  @Get(':id/movements')
  @RequirePermissions(Permissions.WORKSHOP_MOVEMENTS.LIST)
  @ApiOperation({ summary: 'Get movement history for a tool' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: ToolMovementDto, isArray: true })
  async getMovements(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.queryBus.execute(
      new GetToolMovementsQuery(id, normalizePaginationParams(page, limit)),
    );
  }
}
