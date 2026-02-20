import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetFinishesQuery } from './get-finishes.query';
import { IFinishRepository } from '../../../domain/repositories/finish.repository';
import { IFinishOutputDto } from '../../dtos/finish-output.dto';
import { FinishResponseMapper } from '../../mappers/finish-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetFinishesQuery)
export class GetFinishesHandler implements IQueryHandler<GetFinishesQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.FINISH_REPOSITORY)
    private readonly finishRepository: IFinishRepository,
  ) {}

  async execute(_query: GetFinishesQuery): Promise<IFinishOutputDto[]> {
    const finishes = await this.finishRepository.findAll();
    return (finishes ?? []).map((finish) =>
      FinishResponseMapper.toResponse(finish),
    );
  }
}
