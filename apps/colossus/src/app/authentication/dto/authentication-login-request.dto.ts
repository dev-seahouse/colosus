import { AuthenticationDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticationLoginRequestDto
  implements AuthenticationDto.IAuthenticationLoginRequestDto
{
  @ApiProperty({
    type: 'string',
    example: 'foo.eggs@bar.com',
    description:
      'The username of the user. For advisors on Connect, this is the email address.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    type: 'string',
    example: 'hunter2',
    description: 'The password of the user.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    type: 'string',
    example: 'foo_eggs_at_bar_com',
    description:
      "The realmId of the tenant governing the user. For advisors on Connect, we suggest that the realm has been created with the advisor's email address mangled to have non-alphanumeric characters replaced with underscores, and the `@` symbol replaced with `_at_`.",
    required: true,
  })
  @IsString()
  realmId?: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '00000000-0000-0000-0000-000000000000',
    description: 'Id of the application within the IAM service.',
    required: true,
  })
  @IsString()
  applicationId?: string;
}
