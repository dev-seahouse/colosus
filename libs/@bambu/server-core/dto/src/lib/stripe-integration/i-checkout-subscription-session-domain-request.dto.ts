import { StripeIntegrationDto } from '@bambu/shared';

export interface ICheckoutSubscriptionSessionDomainRequestDto
  extends StripeIntegrationDto.ICheckoutSubscriptionSessionRequestDto {
  originUrl: string;
  email: string;
  userId: string;
  requestId: string;
  realm: string;
  realmId: string;
  allowPromotionCodes?: boolean;
}
