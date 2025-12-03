import { Body, Controller, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiParam, ApiTags } from "@nestjs/swagger";

import { UpdateUserCommand } from "../../../application/commands/update-user/update-user.command";
import { UpdateUserDto } from "../dtos/update-user.dto";

@ApiTags('Users')
@Controller('users')
export class UpdateUserController {
  constructor(
    private readonly commandBus: CommandBus,
  ) { }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true, description: 'User ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const command = new UpdateUserCommand(id, dto.name);
    await this.commandBus.execute(command);

    return {
      statusCode: HttpStatus.OK,
      message: `User with id ${id} updated successfully`,
    }
  }

}
