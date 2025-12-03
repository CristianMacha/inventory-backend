import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'cristianmx10' })
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}