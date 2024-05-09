import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ConnectAdvisorDto } from '@bambu/shared';

export class ConnectAdvisorLoginRequestDto
  implements ConnectAdvisorDto.IConnectAdvisorLoginRequestDto
{
  @ApiProperty({
    type: 'string',
    example: 'foo.eggs@bar.com',
    description:
      'The username of the advisor. For advisors on Connect, this is the email address.',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty({
    type: 'string',
    example: 'hunter2',
    description: 'The password of the advisor.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
