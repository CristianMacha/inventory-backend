import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from '../../../users/application/dtos/user-types.dto';

@Injectable()
export class AuthResponseService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(user: AuthUserDto): string {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
      roles: user.roles,
      permissions: user.permissions,
    };
    return this.jwtService.sign(payload);
  }
}
