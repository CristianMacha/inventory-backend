import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';

import { CreateWorkshopCategoryCommand } from '../../../application/commands/create-workshop-category/create-workshop-category.command';
import { UpdateWorkshopCategoryCommand } from '../../../application/commands/update-workshop-category/update-workshop-category.command';
import { GetWorkshopCategoriesQuery } from '../../../application/queries/get-workshop-categories/get-workshop-categories.query';
import { CreateWorkshopCategoryDto } from '../dtos/create-workshop-category.dto';
import { UpdateWorkshopCategoryDto } from '../dtos/update-workshop-category.dto';
import { WorkshopCategoryDto } from '../../../application/dtos/workshop-category.dto';

@ApiBearerAuth()
@ApiTags('Workshop - Categories')
@Controller('workshop/categories')
export class WorkshopCategoriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(Permissions.WORKSHOP_CATEGORIES.CREATE)
  @ApiOperation({ summary: 'Create a workshop category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 409, description: 'Category name already exists' })
  async create(@Body() dto: CreateWorkshopCategoryDto): Promise<void> {
    await this.commandBus.execute(
      new CreateWorkshopCategoryCommand(dto.name, dto.description),
    );
  }

  @Get()
  @RequirePermissions(Permissions.WORKSHOP_CATEGORIES.LIST)
  @ApiOperation({ summary: 'Get all workshop categories' })
  @ApiResponse({ status: 200, type: WorkshopCategoryDto, isArray: true })
  async findAll(): Promise<WorkshopCategoryDto[]> {
    return this.queryBus.execute(new GetWorkshopCategoriesQuery());
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_CATEGORIES.UPDATE)
  @ApiOperation({ summary: 'Update a workshop category' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWorkshopCategoryDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateWorkshopCategoryCommand(id, dto.name, dto.description),
    );
  }
}
