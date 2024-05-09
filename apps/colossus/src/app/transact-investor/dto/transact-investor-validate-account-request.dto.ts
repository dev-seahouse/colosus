import { IColossusUserOtpRequestDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class TransactInvestorValidateAccountRequestDto
  implements IColossusUserOtpRequestDto
{
  @ApiProperty({
    type: 'string',
    example: '123456',
    description: 'The OTP of the investor.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({
    type: 'string',
    example: 'john.doe@email.com',
    required: true,
    description: 'The username of the investor.',
    format: 'email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  username: string;
}
