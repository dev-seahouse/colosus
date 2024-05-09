import { ApiProperty } from '@nestjs/swagger';
import {
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { TenantBrandingDto } from '@bambu/shared';

export class TenantBrandingScalarsDto
  implements TenantBrandingDto.ITenantBrandingScalarsDto
{
  @ApiProperty({
    type: 'string',
    example: '#2e41bf',
    description:
      'The background color of the header. This should be a valid CSS color.',
    required: true,
  })
  @IsOptional()
  // c.f. IsHexColor implemented here. https://github.com/validatorjs/validator.js/blob/master/src/lib/isHexColor.js
  // We require the leading #, and we require 3 or 6 hex digits.
  @Matches(/^#([0-9A-F]{6})$/i)
  headerBgColor: string;

  @ApiProperty({
    type: 'string',
    example: '#5ec4a7',
    description:
      'The brand (primary accent) color. This should be a valid CSS color.',
    required: true,
  })
  @IsNotEmpty()
  // c.f. IsHexColor implemented here. https://github.com/validatorjs/validator.js/blob/master/src/lib/isHexColor.js
  // We require the leading #, and we require 3 or 6 hex digits.
  @Matches(/^#([0-9A-F]{6})$/i)
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
