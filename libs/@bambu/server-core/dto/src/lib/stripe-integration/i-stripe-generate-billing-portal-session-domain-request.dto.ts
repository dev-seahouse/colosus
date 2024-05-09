export interface IStripeGenerateBillingPortalSessionDomainRequestDto {
  userId: string;
  origin: string;
  requestId: string;
  returnUrl?: string;
}
