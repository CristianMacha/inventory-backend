import { Finish } from '@contexts/inventory/domain/entities/finish';
import { IFinishOutputDto } from '@contexts/inventory/application/dtos/finish-output.dto';

export class FinishResponseMapper {
  public static toResponse(finish: Finish): IFinishOutputDto {
    return {
      id: finish.id.getValue(),
      name: finish.name,
      abbreviation: finish.abbreviation,
      description: finish.description,
      isActive: finish.isActive,
      createdAt: finish.createdAt.toISOString(),
      updatedAt: finish.updatedAt.toISOString(),
    };
  }
}
