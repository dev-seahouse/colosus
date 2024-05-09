import {
  InvestorBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto,
  InvestorBrokerageUkDirectDebitSubscriptionListAllResponseDto,
  InvestorBrokerageUkDirectDebitSubscriptionStatusEnum,
} from '@bambu/api-client';
import { QueryArgs } from '../../types/utils';
import useGetDirectDebitSubscriptions from './useGetDirectDebitSubscriptions';

export function useSelectHasActiveDirectDebitSubscriptions(
  args: Omit<
    InvestorBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto,
    'limit' | 'status'
  >,
  queryOptions?: Omit<
    QueryArgs<
      InvestorBrokerageUkDirectDebitSubscriptionListAllResponseDto,
      boolean
    >,
    'select'
  >
) {
  return useGetDirectDebitSubscriptions(
    {
      ...args,
      limit: 2,
      status: InvestorBrokerageUkDirectDebitSubscriptionStatusEnum.ACTIVE,
    },
    {
      ...queryOptions,
      select: (data) => !!data.results.length,
    }
  );
}

export function useSelectHasPendingDirectDebitSubscriptions(
  args: Omit<
    InvestorBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto,
    'limit' | 'status'
  >,
  queryOptions?: Omit<
    QueryArgs<
      InvestorBrokerageUkDirectDebitSubscriptionListAllResponseDto,
      boolean
    >,
    'select'
  >
) {
  return useGetDirectDebitSubscriptions(
    {
      ...args,
      limit: 2,
      status: InvestorBrokerageUkDirectDebitSubscriptionStatusEnum.CREATED,
    },
    {
      ...queryOptions,
      select: (data) => !!data.results.length,
    }
  );
}
