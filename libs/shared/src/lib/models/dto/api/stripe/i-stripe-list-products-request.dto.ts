import { IStripeCreatedListPricesDto } from './i-stripe-created-list-prices.dto';
import { StripeProductTypeEnum } from './stripe-product-type.enum';

export interface IStripeListProductsRequestDto {
  active?: boolean;
  created?: IStripeCreatedListPricesDto | number;

  /**
   * Only for backend calls, front-end will not have access to this.
   */
  expand?: Array<string>;
  ids?: Array<string>;
  shippable?: boolean;
  type?: StripeProductTypeEnum;
  url?: string;
  ending_before?: string;
  limit?: number;
  starting_after?: string;
}
