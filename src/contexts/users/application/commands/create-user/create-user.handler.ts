import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";

import { CreateUserCommand } from "./create-user.command";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { User } from "../../../domain/entities/user";
import { UserAlreadyExistsException } from "../../../domain/exceptions/user-already-exists.exception";
import { IUuidGenerator } from "../../../../../shared/domain/uuid-generator.interface";
import { IHasher } from "../../../../../shared/domain/hasher.interface";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    @Inject('UuidGenerator') private readonly uuidGenerator: IUuidGenerator,
    @Inject('Hasher') private readonly hasher: IHasher,
  ) { }

  async execute(command: CreateUserCommand): Promise<void> {
    const { email, name, password } = command;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsException(email);
    }

    const userId = this.uuidGenerator.generate();
    const user = await User.create(userId, name, email, password, this.hasher);
    await this.userRepository.save(user);
  }
}