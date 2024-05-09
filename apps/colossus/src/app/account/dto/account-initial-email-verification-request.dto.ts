import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IAccountInitialEmailVerificationRequestDto } from '@bambu/shared';

export class AccountInitialEmailVerificationRequestDto
  implements IAccountInitialEmailVerificationRequestDto
{
  @ApiProperty({
    type: 'string',
    example: 'foo_eggs_at_bar_com',
    description:
      "The realmId of the tenant governing the user. For advisors on Connect, we suggest that the realm has been created with the advisor's email address mangled to have non-alphanumeric characters replaced with underscores, and the `@` symbol replaced with `_at_`.",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  tenantName: string;

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
    example: '902832',
    description: "The OTP sent to the user's email.",
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
