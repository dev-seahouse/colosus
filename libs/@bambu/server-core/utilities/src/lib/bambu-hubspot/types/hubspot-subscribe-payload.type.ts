import { PublicUpdateSubscriptionStatusRequestLegalBasisEnum } from '@hubspot/api-client/lib/codegen/communication_preferences';

export type HubspotSubscribePayload = {
  email: string;
  subscriptionID: string;
  legalBasis: PublicUpdateSubscriptionStatusRequestLegalBasisEnum;
  legalBasisExplanation: string;
  source?: string;
};
