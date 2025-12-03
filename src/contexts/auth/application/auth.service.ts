import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { IUserRepository } from "../../users/domain/repositories/user.repository";
import { IHasher } from "../../../shared/domain/hasher.interface";
import { UserOutputDto } from "../../users/application/dtos/user.output.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('Hasher')
    private readonly hasher: IHasher,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<UserOutputDto | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await user.comparePassword(password, this.hasher);
    if (!isPasswordValid) return null;

    return new UserOutputDto(user.getId(), user.getName(), user.getEmail());
  }

  async login(user: UserOutputDto): Promise<{ accessToken: string }> {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

}