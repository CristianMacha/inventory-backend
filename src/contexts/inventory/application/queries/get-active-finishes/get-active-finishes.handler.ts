import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetActiveFinishesQuery } from './get-active-finishes.query';
import { IFinishRepository } from '../../../domain/repositories/finish.repository';
import { IFinishOutputDto } from '../../dtos/finish-output.dto';
import { FinishResponseMapper } from '../../mappers/finish-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetActiveFinishesQuery)
export class GetActiveFinishesHandler implements IQueryHandler<GetActiveFinishesQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.FINISH_REPOSITORY)
    private readonly finishRepository: IFinishRepository,
  ) {}

  async execute(_query: GetActiveFinishesQuery): Promise<IFinishOutputDto[]> {
    const finishes = await this.finishRepository.findAllActive();
    return finishes.map((f) => FinishResponseMapper.toResponse(f));
  }
}
