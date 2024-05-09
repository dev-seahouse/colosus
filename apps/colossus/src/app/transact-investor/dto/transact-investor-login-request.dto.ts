import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class TransactInvestorLoginRequestDto {
  @ApiProperty({
    type: 'string',
    example: 'john.doe@email.com',
    description: 'The username of the investor.',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty({
    type: 'string',
    example: 'hunterr2',
    description: 'The password of the investor.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
