import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserCommand } from '@contexts/users/application/commands/create-user/create-user.command';

import { Public } from '@contexts/auth/infrastructure/decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body or role not found.',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists.',
  })
  async handle(@Body() dto: CreateUserDto) {
    const command = new CreateUserCommand(
      dto.email,
      dto.name,
      dto.password,
      dto.roleNames,
    );
    await this.commandBus.execute(command);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
    };
  }
}
