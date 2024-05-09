import { StripeBillingAddressCollectionEnum } from './stripe-billing-address-collection.enum';

export interface ICheckoutSubscriptionSessionRequestLineItemsDto {
  priceId: string;
  quantity: number;
}

export interface ICheckoutSubscriptionSessionRequestDto {
  billingAddressCollection: StripeBillingAddressCollectionEnum;
  lineItems: ICheckoutSubscriptionSessionRequestLineItemsDto[];
}

export interface ISubscriptionUpgradeRequestDto {
  subscriptionId: string;
  priceId: string;
}
export interface ISubscriptionUpgradeResponseDto {
  success: boolean;
  message?: string;
}

export interface IGetSubscriptionUpgradeDetailsResponseDto {
  cost: number;
  startDate: string;
}
