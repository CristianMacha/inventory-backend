import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { GetUsersQuery } from "./get-users.query";
import { UserEntity } from "../../../infrastructure/persistence/typeorm/entities/user.entity";
import { UserOutputDto } from "../../dtos/user.output.dto";

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersReadRepository: Repository<UserEntity>,
  ) { }

  async execute(query: GetUsersQuery): Promise<UserOutputDto[]> {
    const entities = await this.usersReadRepository.find();
    return entities.map(entity => new UserOutputDto(
      entity.id,
      entity.name,
      entity.email,
    ));
  }
}