import { ApiProperty } from '@nestjs/swagger';
import { ConnectInvestorProxyConfigDto } from '@bambu/server-core/dto';

export class GetInvestorUiProxyConfigResponseSeoDataDto
  implements
    ConnectInvestorProxyConfigDto.IGetInvestorUiProxyConfigResponseSeoDataDto
{
  @ApiProperty({
    type: 'string',
    description: 'SEO description for open graph node.',
    required: false,
  })
  description: string | null;

  @ApiProperty({
    type: 'string',
    description: 'SEO image for open graph node.',
    required: false,
  })
  image: string | null;

  @ApiProperty({
    type: 'string',
    description: 'SEO title for title node.',
    required: false,
  })
  title: string | null;
}

export class GetInvestorUiProxyConfigResponseDto
  implements ConnectInvestorProxyConfigDto.IGetInvestorUiProxyConfigResponseDto
{
  @ApiProperty({
    type: 'boolean',
    description:
      'Denotes if the requested origin header value is valid or not.',
    required: true,
  })
  isValid: boolean;

  @ApiProperty({
    type: GetInvestorUiProxyConfigResponseSeoDataDto,
    description: 'SEO data points to be used.',
  })
  seoData: GetInvestorUiProxyConfigResponseSeoDataDto;
}
