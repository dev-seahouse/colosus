import { StripeRecurringIntervalEnum } from './stripe-recurring-interval.enum';
import { StripeRecurringUsageTypeEnum } from './stripe-recurring-usage-type.enum';

export interface IStripeRecurringPaymentConfigurationDto {
  interval: StripeRecurringIntervalEnum;
  usage_type: StripeRecurringUsageTypeEnum;
}
