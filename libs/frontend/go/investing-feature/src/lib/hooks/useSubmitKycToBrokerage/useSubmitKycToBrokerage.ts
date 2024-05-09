import type {
  InvestorBrokerageApiRequestDto,
  InvestorBrokerageApiResponseDto,
} from '@bambu/api-client';
import { TransactInvestorAuthenticatedBrokerageApi } from '@bambu/api-client';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

export function useSubmitKycToBrokerage(
  queryOptions?: UseMutationOptions<
    InvestorBrokerageApiResponseDto,
    AxiosError,
    InvestorBrokerageApiRequestDto
  >
) {
  return useMutation({
    mutationKey: ['submitKycToBrokerage'],
    mutationFn: postKycToBrokerage,
    ...queryOptions,
  });
}

async function postKycToBrokerage(args: InvestorBrokerageApiRequestDto) {
  const investorBrokerageApi = new TransactInvestorAuthenticatedBrokerageApi();
  const res = await investorBrokerageApi.submitKycToBrokerage(args);
  return res.data;
}

export default useSubmitKycToBrokerage;
