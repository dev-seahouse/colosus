import { ConnectAdvisorDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConnectAdvisorCreateRequestDto
  implements ConnectAdvisorDto.IConnectAdvisorCreateRequestDto
{
  @ApiProperty({
    type: 'string',
    example: 'foo.eggs@bar.com',
    description:
      'The username of the advisor. For advisors on Connect, this is the email address.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    type: 'string',
    example: 'Hunter2!',
    description: 'The password of the advisor.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    type: 'boolean',
    required: false,
    description: 'Whether or not to enable marketing for the advisor.',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  enableMarketing?: boolean;
}
