import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUsersQuery } from '../../../application/queries/get-users/get-users.query';
import { UserListDto } from '@contexts/users/application/dtos/user-types.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class GetUsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with their roles' })
  @ApiOkResponse({ type: [UserListDto], description: 'List of users' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  async findAll(): Promise<UserListDto[]> {
    const query = new GetUsersQuery();
    return await this.queryBus.execute(query);
  }
}
