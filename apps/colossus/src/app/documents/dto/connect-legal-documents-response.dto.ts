import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import {
  ConnectLegalDocumentsDto,
  TenantBrandingDto as ITenantBrandingDto,
} from '@bambu/shared';

export class ConnectLegalDocumentsResponse
  implements ConnectLegalDocumentsDto.IConnectLegalDocumentsDto
{
  @ApiProperty({
    type: 'string',
    example: 'https://myaccount.blob.core.windows.net/mycontainer/myblob',
    description: 'A URL to the logo of the tenant.',
    nullable: true,
  })
  @IsString()
  privacyPolicyUrl: string | null;

  @ApiProperty({
    type: 'string',
    example: 'https://myaccount.blob.core.windows.net/mycontainer/myblob',
    description: 'A URL to the logo of the tenant.',
    nullable: true,
  })
  @IsString()
  termsAndConditionsUrl: string | null;
}
