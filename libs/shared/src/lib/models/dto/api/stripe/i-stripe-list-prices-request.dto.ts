import { StripePriceTypeEnum } from './stripe-price-type.enum';
import { IStripeRecurringPaymentConfigurationDto } from './i-stripe-recurring-payment-configuration.dto';
import { IStripeCreatedListPricesDto } from './i-stripe-created-list-prices.dto';

export interface IStripeListPricesRequestDto {
  active?: boolean;
  currency?: string;
  product?: string;
  type?: StripePriceTypeEnum;
  created?: IStripeCreatedListPricesDto;
  ending_before?: string;
  limit?: number;
  lookup_keys?: string[];
  recurring?: IStripeRecurringPaymentConfigurationDto;
  starting_after?: string;

  /**
   * Not exposed in API function.
   * Currently only for internal server function calls.
   */
  expand?: string[];

  /**
   * Only here for request tracing.
   */
  requestId: string;
}
