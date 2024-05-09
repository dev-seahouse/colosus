import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ConnectAdvisorDto } from '@bambu/shared';

export class ConnectAdvisorSendResetPasswordEmailOtpRequestDto
  implements
    ConnectAdvisorDto.IConnectAdvisorSendResetPasswordEmailOtpRequestDto
{
  @ApiProperty({
    type: 'string',
    example: 'foo.eggs@bar.com',
    description: 'The email of the advisor.',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
