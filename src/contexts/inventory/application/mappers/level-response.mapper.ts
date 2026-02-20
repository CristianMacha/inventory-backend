import { Level } from '@contexts/inventory/domain/entities/level';
import { ILevelOutputDto } from '@contexts/inventory/application/dtos/level-output.dto';

export class LevelResponseMapper {
  public static toResponse(level: Level): ILevelOutputDto {
    return {
      id: level.id.getValue(),
      name: level.name,
      sortOrder: level.sortOrder,
      description: level.description,
      isActive: level.isActive,
      createdAt: level.createdAt.toISOString(),
      updatedAt: level.updatedAt.toISOString(),
    };
  }
}
