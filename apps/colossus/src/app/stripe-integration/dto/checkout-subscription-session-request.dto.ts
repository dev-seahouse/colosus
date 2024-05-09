import { StripeIntegrationDto } from '@bambu/shared';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CheckoutSubscriptionSessionRequestLineItemDto } from './checkout-subscription-session-request-line-item.dto';
import { Type } from 'class-transformer';

export class CheckoutSubscriptionSessionRequestDto
  implements StripeIntegrationDto.ICheckoutSubscriptionSessionRequestDto
{
  @ApiProperty({
    enum: StripeIntegrationDto.StripeBillingAddressCollectionEnum,
    example: StripeIntegrationDto.StripeBillingAddressCollectionEnum.REQUIRED,
    required: true,
    description:
      "Specify whether Checkout should collect the customer's billing address.",
  })
  @IsNotEmpty()
  @IsEnum(StripeIntegrationDto.StripeBillingAddressCollectionEnum)
  billingAddressCollection: StripeIntegrationDto.StripeBillingAddressCollectionEnum;

  @ApiProperty({
    type: CheckoutSubscriptionSessionRequestLineItemDto,
    isArray: true,
    required: true,
    minItems: 1,
    maxItems: 1,
    description: `Line items for subscription. Only 1 item supported for now.`,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMinSize(1)
  @Type(() => CheckoutSubscriptionSessionRequestLineItemDto)
  lineItems: CheckoutSubscriptionSessionRequestLineItemDto[];
}
