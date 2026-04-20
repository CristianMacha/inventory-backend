import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetFinishByIdQuery } from './get-finish-by-id.query';
import { IFinishRepository } from '@contexts/inventory/domain/repositories/finish.repository';
import { IFinishOutputDto } from '@contexts/inventory/application/dtos/finish-output.dto';
import { FinishResponseMapper } from '@contexts/inventory/application/mappers/finish-response.mapper';
import { FinishId } from '@contexts/inventory/domain/value-objects/finish-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetFinishByIdQuery)
export class GetFinishByIdHandler implements IQueryHandler<GetFinishByIdQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.FINISH_REPOSITORY)
    private readonly finishRepository: IFinishRepository,
  ) {}

  async execute(query: GetFinishByIdQuery): Promise<IFinishOutputDto> {
    const finish = await this.finishRepository.findById(
      FinishId.create(query.id),
    );
    if (!finish) {
      throw new ResourceNotFoundException('Finish', query.id);
    }
    return FinishResponseMapper.toResponse(finish);
  }
}
