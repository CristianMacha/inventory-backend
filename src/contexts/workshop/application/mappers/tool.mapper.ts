import { Tool } from '../../domain/entities/tool.entity';
import { ToolDto } from '../dtos/tool.dto';

export class ToolMapper {
  static toDto(tool: Tool): ToolDto {
    return {
      id: tool.id.getValue(),
      name: tool.name,
      description: tool.description,
      status: tool.status,
      categoryId: tool.categoryId,
      supplierId: tool.supplierId,
      imagePublicId: tool.imagePublicId,
      purchasePrice: tool.purchasePrice,
      createdBy: tool.createdBy,
      updatedBy: tool.updatedBy,
      createdAt: tool.createdAt.toISOString(),
      updatedAt: tool.updatedAt.toISOString(),
    };
  }
}
