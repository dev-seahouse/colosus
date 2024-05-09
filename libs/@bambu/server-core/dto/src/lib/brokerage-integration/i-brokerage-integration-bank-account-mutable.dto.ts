export interface IBrokerageIntegrationBankAccountMutableDto {
  partyId: string;
  clientReference?: string | null;
  name: string;
  accountNumber: string;
  sortCode: string;
  currency: string;
  countryCode: string;
}
