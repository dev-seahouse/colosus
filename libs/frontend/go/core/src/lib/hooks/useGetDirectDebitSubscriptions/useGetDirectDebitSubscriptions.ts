import {
  InvestorBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto,
  InvestorBrokerageUkDirectDebitSubscriptionListAllResponseDto,
  InvestorBrokerageUkDirectDebitSubscriptionStatusEnum,
  TransactInvestorAuthenticatedBrokerageApi,
} from '@bambu/api-client';
import { useQuery } from '@tanstack/react-query';
import { QueryArgs } from '../../types/utils';

const GET_DIRECT_DEBIT_SUB_QUERY_KEY = 'getDirectDebitSubscriptions';

export function useGetDirectDebitSubscriptions<
  T = InvestorBrokerageUkDirectDebitSubscriptionListAllResponseDto
>(
  args: InvestorBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto,
  queryOptions?: QueryArgs<
    InvestorBrokerageUkDirectDebitSubscriptionListAllResponseDto,
    T
  >
) {
  return useQuery({
    queryKey: [
      GET_DIRECT_DEBIT_SUB_QUERY_KEY,
      args.goalId,
      args.status,
      args.mandateId,
      args.after,
      args.limit,
    ],
    queryFn: () => fetchDirectDebitSubscriptions(args),
    retry: (count, error) => {
      if (error?.response?.data.message === 'Portfolio not found for goal.') {
        return false;
      }
      return count < 3;
    },
    ...queryOptions,
  });
}

async function fetchDirectDebitSubscriptions(
  args: InvestorBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
) {
  const api = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await api.getDirectDebitSubscriptions(args);
  return res.data;
}

export function selectHasActiveOrPendingSubscription(
  data: InvestorBrokerageUkDirectDebitSubscriptionListAllResponseDto
) {
  if (!data) return false;
  if (!Array.isArray(data.results)) return false;
  return data.results.some(
    (sub) =>
      sub.status ===
        InvestorBrokerageUkDirectDebitSubscriptionStatusEnum.ACTIVE ||
      sub.status ===
        InvestorBrokerageUkDirectDebitSubscriptionStatusEnum.CREATED
  );
}

export default useGetDirectDebitSubscriptions;
