import { Controller, Get } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { GetUsersQuery } from "../../../application/queries/get-users/get-users.query";
import { UserPresentationDto } from "../dtos/user-presentation.dto";

@ApiTags('Users')
@Controller('users')
export class GetUsersController {
  constructor(private readonly queryBus: QueryBus) { }

  @Get()
  @ApiOkResponse({ type: [UserPresentationDto], description: 'List of users' })
  async findAll(): Promise<UserPresentationDto[]> {
    const query = new GetUsersQuery();
    const users = await this.queryBus.execute(query);
    return users;
  }
}
