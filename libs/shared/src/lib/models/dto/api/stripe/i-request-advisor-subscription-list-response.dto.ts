import Stripe from 'stripe';

export interface IRequestAdvisorSubscriptionListResponseDto {
  subscriptions: Stripe.Subscription[];
}
