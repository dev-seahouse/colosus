export interface IStripeSearchPricesRequestDto {
  query: string;
  limit?: number;
  page?: string;
  /**
   * This is meant for server side requests only.
   * Do not use in front end calls.
   */
  requestId?: string;
}
