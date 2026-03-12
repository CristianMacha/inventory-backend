import { Tool } from '../../../../domain/entities/tool.entity';
import { ToolId } from '../../../../domain/value-objects/tool-id';
import { ToolTypeormEntity } from '../entities/tool.typeorm.entity';

export class ToolPersistenceMapper {
  static toDomain(entity: ToolTypeormEntity): Tool {
    return Tool.reconstitute(
      ToolId.create(entity.id),
      entity.name,
      entity.description,
      entity.status,
      entity.categoryId,
      entity.supplierId,
      entity.imagePublicId,
      entity.purchasePrice !== null ? Number(entity.purchasePrice) : null,
      entity.createdBy,
      entity.updatedBy,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Tool): ToolTypeormEntity {
    const entity = new ToolTypeormEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.description = domain.description;
    entity.status = domain.status;
    entity.categoryId = domain.categoryId;
    entity.supplierId = domain.supplierId;
    entity.imagePublicId = domain.imagePublicId;
    entity.purchasePrice = domain.purchasePrice;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
