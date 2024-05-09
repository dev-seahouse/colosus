import type {
  InvestorBrokerageGetNextPossiblePaymentRequestDto,
  InvestorBrokerageGetNextPossiblePaymentResponseDto,
} from '@bambu/api-client';
import { TransactInvestorAuthenticatedBrokerageApi } from '@bambu/api-client';
import { useQuery } from '@tanstack/react-query';
import type { QueryArgs } from '@bambu/go-core';

const getNextPossiblePaymentDateQuery = (
  args: InvestorBrokerageGetNextPossiblePaymentRequestDto
) => ({
  queryKey: ['getNextPossiblePaymentDate', args],
  queryFn: async () => fetchNextPossiblePaymentDate(args),
});

export function useUseGetNextPossiblePaymentDate(
  args: InvestorBrokerageGetNextPossiblePaymentRequestDto,
  queryOptions?: QueryArgs<InvestorBrokerageGetNextPossiblePaymentResponseDto>
) {
  return useQuery({
    ...getNextPossiblePaymentDateQuery(args),
    ...queryOptions,
  });
}

async function fetchNextPossiblePaymentDate(
  args: InvestorBrokerageGetNextPossiblePaymentRequestDto
) {
  const brokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await brokerageApi.getNextPossiblePaymentDate(args);
  return res.data;
}

export default useUseGetNextPossiblePaymentDate;
