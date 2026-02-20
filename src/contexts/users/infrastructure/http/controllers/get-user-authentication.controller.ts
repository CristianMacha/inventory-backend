import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserOutputDto } from '@contexts/users/application/dtos/user.output.dto';
import { GetUserAuthenticationQuery } from '@contexts/users/application/queries/get-user-authentication/get-user-authentication.query';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class GetUserAuthenticationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user information' })
  @ApiOkResponse({
    type: UserOutputDto,
    description: 'Authenticated user information',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  async getAuthenticatedUser(
    @GetUser() user: AuthUserDto,
  ): Promise<UserOutputDto> {
    const query = new GetUserAuthenticationQuery(user.id);
    return await this.queryBus.execute(query);
  }
}
