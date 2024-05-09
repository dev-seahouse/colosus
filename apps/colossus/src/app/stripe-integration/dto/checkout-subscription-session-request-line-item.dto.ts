import { StripeIntegrationDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CheckoutSubscriptionSessionRequestLineItemDto
  implements
    StripeIntegrationDto.ICheckoutSubscriptionSessionRequestLineItemsDto
{
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'Stripe API price id.',
  })
  @IsNotEmpty()
  @IsString()
  priceId: string;

  @ApiProperty({
    type: 'integer',
    required: true,
    description: 'Number of subscriptions to get.',
    minimum: 1,
    maximum: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1)
  quantity: number;
}
