import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ConnectTenantDto } from '@bambu/shared';

export class ConnectTenantTradeNameAndSubdomainDto
  implements ConnectTenantDto.IConnectTenantTradeNameAndSubdomainDto
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
  tradeName: string;

  @ApiProperty({
    type: 'string',
    example: 'fe-alex',
    description: 'The subdomain associated with the tenant.',
    required: true,
  })
  @Length(2, 15)
  @Matches(/^[a-z0-9-]+$/)
  @IsString()
  subdomain: string;
}
