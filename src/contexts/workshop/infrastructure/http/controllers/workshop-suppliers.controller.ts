import {
  Body, Controller, Get, HttpCode, HttpStatus,
  Param, ParseUUIDPipe, Patch, Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';

import { CreateWorkshopSupplierCommand } from '../../../application/commands/create-workshop-supplier/create-workshop-supplier.command';
import { UpdateWorkshopSupplierCommand } from '../../../application/commands/update-workshop-supplier/update-workshop-supplier.command';
import { GetWorkshopSuppliersQuery } from '../../../application/queries/get-workshop-suppliers/get-workshop-suppliers.query';
import { CreateWorkshopSupplierDto } from '../dtos/create-workshop-supplier.dto';
import { UpdateWorkshopSupplierDto } from '../dtos/update-workshop-supplier.dto';
import { WorkshopSupplierDto } from '../../../application/dtos/workshop-supplier.dto';

@ApiBearerAuth()
@ApiTags('Workshop - Suppliers')
@Controller('workshop/suppliers')
export class WorkshopSuppliersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(Permissions.WORKSHOP_SUPPLIERS.CREATE)
  @ApiOperation({ summary: 'Create a workshop supplier' })
  @ApiResponse({ status: 201, description: 'Supplier created successfully' })
  @ApiResponse({ status: 409, description: 'Supplier name already exists' })
  async create(@Body() dto: CreateWorkshopSupplierDto): Promise<void> {
    await this.commandBus.execute(
      new CreateWorkshopSupplierCommand(dto.name, dto.phone, dto.email, dto.address, dto.notes),
    );
  }

  @Get()
  @RequirePermissions(Permissions.WORKSHOP_SUPPLIERS.LIST)
  @ApiOperation({ summary: 'Get all workshop suppliers' })
  @ApiResponse({ status: 200, type: WorkshopSupplierDto, isArray: true })
  async findAll(): Promise<WorkshopSupplierDto[]> {
    return this.queryBus.execute(new GetWorkshopSuppliersQuery());
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_SUPPLIERS.UPDATE)
  @ApiOperation({ summary: 'Update a workshop supplier' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Supplier updated successfully' })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWorkshopSupplierDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateWorkshopSupplierCommand(id, dto.name, dto.phone, dto.email, dto.address, dto.notes, dto.isActive),
    );
  }
}
