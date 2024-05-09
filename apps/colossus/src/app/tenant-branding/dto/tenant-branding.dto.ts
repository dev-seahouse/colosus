import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TenantBrandingDto as ITenantBrandingDto } from '@bambu/shared';

export class TenantBrandingDto
  implements ITenantBrandingDto.ITenantBrandingDto
{
  @ApiProperty({
    type: 'string',
    example: 'bd0bac16-7c06-4b30-97a0-4280438a3e70',
    description: 'The UUID by which Colossus identifies the tenant.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  tenantId: string;

  @ApiProperty({
    type: 'string',
    example: 'https://myaccount.blob.core.windows.net/mycontainer/myblob',
    description:
      'A URL to the logo of the tenant, if the tenant chooses to use a logo.',
  })
  @IsOptional()
  @IsString()
  logoUrl: string;

  @ApiProperty({
    type: 'string',
    example: '#2e41bf',
    description:
      'The background color of the header. This should be a valid CSS color.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  headerBgColor: string;

  @ApiProperty({
    type: 'string',
    example: '#5ec4a7',
    description:
      'The brand (primary accent) color. This should be a valid CSS color.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  brandColor: string;

  @ApiProperty({
    type: 'string',
    example: 'Bullion',
    description: 'The name under which the advisor is doing business.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  tradeName: string;
}
