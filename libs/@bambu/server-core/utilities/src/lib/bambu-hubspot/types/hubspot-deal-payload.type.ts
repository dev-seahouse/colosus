export type HubspotDealPayload = {
  dealName: string;
  dealStage: string;
  contactEmail: string;
  amount?: number;
  pipeline?: string;
  hubspotOwnerID?: string;
};
