import { StripeIntegrationDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';

export class StripeCreateRequestDto
  implements StripeIntegrationDto.IStripeCreatedListPricesDto
{
  @ApiProperty({
    type: 'integer',
  })
  gt?: number;

  @ApiProperty({
    type: 'integer',
  })
  gte?: number;

  @ApiProperty({
    type: 'integer',
  })
  lt?: number;

  @ApiProperty({
    type: 'integer',
  })
  lte?: number;
}
