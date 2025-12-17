import { ApiProperty } from '@nestjs/swagger';
import { UserOutputDto } from '../../../application/dtos/user.output.dto';

export class UserPresentationDto extends UserOutputDto {
  @ApiProperty({
    example: 'd0b8f1c4-9a7f-4b0c-8d1e-2f3b4c5d6e7f',
    description: 'Identificador único del usuario',
  })
  declare readonly id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre del usuario',
  })
  declare readonly name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Correo electrónico del usuario',
  })
  declare readonly email: string;
}
