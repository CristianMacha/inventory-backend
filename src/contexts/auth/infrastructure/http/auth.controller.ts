import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { AuthService } from '@contexts/auth/application/services/auth.service';
import { FirebaseLoginDto } from './dtos/firebase-login.dto';

import { Public } from '../decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @ApiOperation({ summary: 'Login with Firebase ID token' })
  @ApiBody({ type: FirebaseLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns access token and user.',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired ID token.' })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 429, description: 'Too many requests.' })
  async login(@Body() dto: FirebaseLoginDto) {
    return this.authService.loginWithFirebase(dto.idToken);
  }
}
