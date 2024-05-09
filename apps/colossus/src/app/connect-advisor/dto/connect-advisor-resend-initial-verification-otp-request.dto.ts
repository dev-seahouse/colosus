import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ConnectAdvisorResendInitialVerificationOtpRequestDto {
  @ApiProperty({
    type: 'string',
    example: 'john.smith@gmail.com',
    description: 'The email of the account to resent a verification email to.',
    required: true,
  })
  @IsEmail()
  email: string;
}
