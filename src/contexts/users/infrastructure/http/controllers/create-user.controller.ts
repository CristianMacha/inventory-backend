import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";

import { CreateUserDto } from "../dtos/create-user.dto";
import { CreateUserCommand } from "../../../application/commands/create-user/create-user.command";

@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(
    private readonly commandBus: CommandBus
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() dto: CreateUserDto) {
    const command = new CreateUserCommand(dto.email, dto.name, dto.password);
    await this.commandBus.execute(command);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
    }
  }
}