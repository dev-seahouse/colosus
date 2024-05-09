import { ApiProperty } from '@nestjs/swagger';

import { IBambuApiLibraryGetCountriesResponseDto } from '@bambu/shared';

export class BambuApiLibraryGetCountriesResponseDto
  implements IBambuApiLibraryGetCountriesResponseDto
{
  @ApiProperty({
    description: '2 Character Country identifier (Alpha-2).',
    type: 'string',
    example: 'US',
  })
  code: string;

  @ApiProperty({
    description: 'Unique dialing codes which are country specific.',
    type: 'string',
    example: '1',
  })
  internationalDialingCode: string;

  @ApiProperty({
    description: 'Unique and international identification of a currency.',
    type: 'string',
    example: 'USD',
  })
  currencyCode: string;

  @ApiProperty({
    description: `Image of the country's flag.`,
    type: 'string',
    example: 'https://restcountries.eu/data/usa.svg',
    format: 'uri',
  })
  flag: string;

  @ApiProperty({
    description:
      '3 Character Identifier (Alpha-3) of the country which is recognized internationally.',
    type: 'string',
    example: 'USA',
  })
  cioc: string;

  @ApiProperty({
    description: 'Name of the Country.',
    type: 'string',
    example: 'United States of America',
  })
  name: string;

  @ApiProperty({
    description: 'Denotes the native of a specific country.',
    type: 'string',
    example: 'American',
  })
  demonym: string;

  @ApiProperty({
    description:
      'Country Alpha-2 code. Read more: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2.',
    type: 'string',
    example: 'US',
  })
  cca2: string;

  @ApiProperty({
    description:
      'Country Alpha-3 code. Read more: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3.',
    type: 'string',
    example: 'USA',
  })
  cca3: string;

  @ApiProperty({
    description:
      'Country numeric code. Read more: https://en.wikipedia.org/wiki/ISO_3166-1_numeric.',
    type: 'string',
    example: '840',
  })
  ccn3: string;

  @ApiProperty({
    description:
      '3 Character Identifier of the country, similar to cca3 and cioc.',
    type: 'string',
    example: 'USA',
  })
  id: string;
}
