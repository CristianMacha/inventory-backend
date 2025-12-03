import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { UpdateUserCommand } from "./update-user.command";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { UserNotFoundExeption } from "../../../domain/exceptions/user-not-found.exception";

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
  ) { }

  async execute(command: UpdateUserCommand): Promise<void> {
    const { id, name } = command;
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundExeption(id);
    }

    if (name) {
      user.updateName(name);
    }
    await this.userRepository.save(user);
  }
}