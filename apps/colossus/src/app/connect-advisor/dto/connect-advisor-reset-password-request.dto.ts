import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ConnectAdvisorDto } from '@bambu/shared';

export class ConnectAdvisorResetPasswordRequestDto
  implements ConnectAdvisorDto.IConnectAdvisorResetPasswordRequestDto
{
  @ApiProperty({
    type: 'string',
    example: 'foo.eggs@bar.com',
    description:
      'The username of the user. For advisors on Connect, this is the email address.',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty({
    type: 'string',
    example: '902832',
    description: "The OTP sent to the user's email.",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({
    type: 'string',
    example: 'hunter2',
    description: "The string that the advisor's password should be set to.",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
