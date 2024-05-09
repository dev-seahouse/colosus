import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { StripeIntegrationDto } from '@bambu/shared';
import { Type } from 'class-transformer';
import { CheckoutSubscriptionSessionDomainRequestLineItemsDto } from './checkout-subscription-session-domain-request-line-items.dto';
import { ICheckoutSubscriptionSessionDomainRequestDto } from './i-checkout-subscription-session-domain-request.dto';

export class CheckoutSubscriptionSessionDomainRequestDto
  implements ICheckoutSubscriptionSessionDomainRequestDto
{
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsEnum(StripeIntegrationDto.StripeBillingAddressCollectionEnum)
  billingAddressCollection: StripeIntegrationDto.StripeBillingAddressCollectionEnum;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMinSize(1)
  @Type(() => CheckoutSubscriptionSessionDomainRequestLineItemsDto)
  lineItems: CheckoutSubscriptionSessionDomainRequestLineItemsDto[];

  @IsNotEmpty()
  // TODO: call from config
  @IsUrl({ require_tld: process.env.NODE_ENV === 'production' })
  originUrl: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  requestId: string;

  @IsNotEmpty()
  @IsString()
  realm: string;

  @IsOptional()
  @IsString()
  realmId: string;

  @IsOptional()
  @IsBoolean()
  allowPromotionCodes?: boolean;
}
