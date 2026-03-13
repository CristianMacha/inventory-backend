import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { GetUserMenuQuery } from '../../../application/queries/get-user-menu/get-user-menu.query';
import { MenuResponseDto } from '../../../application/dtos/menu-response.dto';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';

@ApiBearerAuth()
@ApiTags('Users', 'Menu')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class GetUserMenuController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('me/menu')
  @ApiOperation({
    summary:
      'Get menu items for the authenticated user based on their permissions',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu retrieved successfully',
    type: MenuResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  async run(@GetUser() user: AuthUserDto): Promise<MenuResponseDto> {
    return this.queryBus.execute(new GetUserMenuQuery(user.id));
  }
}
