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

import { CreateMaterialCommand } from '../../../application/commands/create-material/create-material.command';
import { UpdateMaterialCommand } from '../../../application/commands/update-material/update-material.command';
import { DeleteMaterialCommand } from '../../../application/commands/delete-material/delete-material.command';
import { RegisterMaterialMovementCommand } from '../../../application/commands/register-material-movement/register-material-movement.command';
import { GetMaterialsQuery } from '../../../application/queries/get-materials/get-materials.query';
import { GetMaterialByIdQuery } from '../../../application/queries/get-material-by-id/get-material-by-id.query';
import { GetMaterialMovementsQuery } from '../../../application/queries/get-material-movements/get-material-movements.query';
import { GetMaterialStockQuery } from '../../../application/queries/get-material-stock/get-material-stock.query';
import { CreateMaterialDto } from '../dtos/create-material.dto';
import { UpdateMaterialDto } from '../dtos/update-material.dto';
import { RegisterMaterialMovementDto } from '../dtos/register-material-movement.dto';
import { MaterialDto } from '../../../application/dtos/material.dto';
import { MaterialMovementDto } from '../../../application/dtos/material-movement.dto';
import { UploadMaterialImageCommand } from '../../../application/commands/upload-material-image/upload-material-image.command';
import { DeleteMaterialImageCommand } from '../../../application/commands/delete-material-image/delete-material-image.command';
import { FileValidationPipe } from '@shared/storage/pipes/file-validation.pipe';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_10MB = 10 * 1024 * 1024;

@ApiBearerAuth()
@ApiTags('Workshop - Materials')
@Controller('workshop/materials')
export class MaterialsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(Permissions.WORKSHOP_MATERIALS.CREATE)
  @ApiOperation({ summary: 'Create a new material' })
  @ApiResponse({ status: 201, description: 'Material created successfully' })
  @ApiResponse({ status: 409, description: 'Material name already exists' })
  async create(
    @Body() dto: CreateMaterialDto,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new CreateMaterialCommand(
        dto.name,
        dto.unit,
        user.id,
        dto.description,
        dto.minStock,
        dto.unitPrice,
        dto.categoryId,
        dto.supplierId,
      ),
    );
  }

  @Get()
  @RequirePermissions(Permissions.WORKSHOP_MATERIALS.LIST)
  @ApiOperation({ summary: 'Get paginated list of materials' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: MaterialDto, isArray: true })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.queryBus.execute(
      new GetMaterialsQuery(normalizePaginationParams(page, limit)),
    );
  }

  @Get(':id')
  @RequirePermissions(Permissions.WORKSHOP_MATERIALS.READ)
  @ApiOperation({ summary: 'Get material by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: MaterialDto })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<MaterialDto> {
    return this.queryBus.execute(new GetMaterialByIdQuery(id));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_MATERIALS.UPDATE)
  @ApiOperation({ summary: 'Update a material' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Material updated successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMaterialDto,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateMaterialCommand(
        id,
        user.id,
        dto.name,
        dto.description,
        dto.unit,
        dto.minStock,
        dto.unitPrice,
        dto.categoryId,
        dto.supplierId,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permissions.WORKSHOP_MATERIALS.DELETE)
  @ApiOperation({ summary: 'Delete a material' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Material deleted successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.commandBus.execute(new DeleteMaterialCommand(id));
  }

  @Post(':id/image')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_MATERIALS.UPDATE)
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
  @ApiOperation({ summary: 'Upload or replace the material image' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
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
      new UploadMaterialImageCommand(id, file, user.id),
    );
  }

  @Delete(':id/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permissions.WORKSHOP_MATERIALS.UPDATE)
  @ApiOperation({ summary: 'Delete the material image' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async deleteImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteMaterialImageCommand(id, user.id));
  }

  @Post(':id/movements')
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(Permissions.WORKSHOP_MOVEMENTS.CREATE)
  @ApiOperation({
    summary: 'Register a material movement (entry, exit or adjustment)',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 201, description: 'Movement registered' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  async registerMovement(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: RegisterMaterialMovementDto,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new RegisterMaterialMovementCommand(
        id,
        dto.delta,
        dto.reason,
        user.id,
        dto.jobId,
        dto.notes,
      ),
    );
  }

  @Get(':id/movements')
  @RequirePermissions(Permissions.WORKSHOP_MOVEMENTS.LIST)
  @ApiOperation({ summary: 'Get paginated movement history for a material' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: MaterialMovementDto, isArray: true })
  async getMovements(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.queryBus.execute(
      new GetMaterialMovementsQuery(id, normalizePaginationParams(page, limit)),
    );
  }

  @Get(':id/stock')
  @RequirePermissions(Permissions.WORKSHOP_MATERIALS.READ)
  @ApiOperation({ summary: 'Get current calculated stock for a material' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    schema: { properties: { currentStock: { type: 'number' } } },
  })
  async getStock(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ currentStock: number }> {
    return this.queryBus.execute(new GetMaterialStockQuery(id));
  }
}
