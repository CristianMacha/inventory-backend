import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserAuthOutputDto } from '@contexts/users/application/dtos/user.output.dto';
import { UserAuthPresentationDto } from '../dtos/user-presentation.dto';
import { GetUserAuthenticationQuery } from '@contexts/users/application/queries/get-user-authentication/get-user-authentication.query';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class GetUserAuthenticationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user profile with permissions' })
  @ApiOkResponse({
    type: UserAuthPresentationDto,
    description: 'Authenticated user info with roles and permissions',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAuthenticatedUser(
    @GetUser() user: AuthUserDto,
  ): Promise<UserAuthOutputDto> {
    const query = new GetUserAuthenticationQuery(user.id);
    return await this.queryBus.execute(query);
  }
}
