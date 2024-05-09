import type {
  InvestorBrokerageGetBankAccountByIdRequestDto,
  InvestorBrokerageBankAccForPartyItem,
} from '@bambu/api-client';
import { TransactInvestorAuthenticatedBrokerageApi } from '@bambu/api-client';
import { QueryArgs } from '../../types/utils';
import { useQuery } from '@tanstack/react-query';

const getBankAccountByIdQuery = (
  args: InvestorBrokerageGetBankAccountByIdRequestDto
) => ({
  queryKey: ['getBankAccountById', args],
  queryFn: () => fetchGetBankAccountById(args),
});

export function useGetBankAccountById(
  args: InvestorBrokerageGetBankAccountByIdRequestDto,
  queryOptions?: QueryArgs<InvestorBrokerageBankAccForPartyItem>
) {
  return useQuery({
    ...getBankAccountByIdQuery(args),
    ...queryOptions,
  });
}

async function fetchGetBankAccountById(
  args: InvestorBrokerageGetBankAccountByIdRequestDto
) {
  const api = new TransactInvestorAuthenticatedBrokerageApi();
  const response = await api.getBankAccountById(args);
  return response.data;
}

export default useGetBankAccountById;
