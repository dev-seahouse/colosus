export class TenantSubscription {
  id: string;
  tenantId?: string | null;
  createdBy?: string;
  createdAt?: Date | string;
  updatedBy?: string;
  updatedAt?: Date | string;
  bambuGoProductId: string;
  subscriptionProviderName: string;
  subscriptionProviderCustomerId: string;
  subscriptionProviderProductId?: string | null;
  providerSubscriptionId?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptionMetadata?: any | null;
  status?: string | null;
  isInterestedInTransact?: boolean;
}
