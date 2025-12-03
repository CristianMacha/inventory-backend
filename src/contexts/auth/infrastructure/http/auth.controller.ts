import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { AuthService } from "../../application/auth.service";
import { LoginDto } from "./dtos/login.dto";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}