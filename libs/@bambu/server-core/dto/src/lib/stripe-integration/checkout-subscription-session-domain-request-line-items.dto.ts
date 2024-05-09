import { StripeIntegrationDto } from '@bambu/shared';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CheckoutSubscriptionSessionDomainRequestLineItemsDto
  implements
    StripeIntegrationDto.ICheckoutSubscriptionSessionRequestLineItemsDto
{
  @IsNotEmpty()
  @IsString()
  priceId: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
