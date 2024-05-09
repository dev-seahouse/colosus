import type {
  InvestorGetGoalDetailsApiRequestDto,
  InvestorGetGoalDetailsApiResponseDto,
} from '@bambu/api-client';
import { TransactInvestorAuthenticatedGoalsApi } from '@bambu/api-client';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { QueryArgs } from '../../types/utils';

const getInvestorGoalDetailsQuery = (
  args: InvestorGetGoalDetailsApiRequestDto
) => ({
  queryKey: ['getInvestorGoalDetails', args],
  queryFn: () => fetchInvestorGoalDetails(args),
});

export function useGetInvestorGoalDetails(
  args: InvestorGetGoalDetailsApiRequestDto,
  queryOptions?: QueryArgs<InvestorGetGoalDetailsApiResponseDto>
) {
  return useQuery({
    ...getInvestorGoalDetailsQuery(args),
    ...queryOptions,
  });
}

export const getInvestorGoalDetailsLoader = (
  queryClient: QueryClient,
  params: InvestorGetGoalDetailsApiRequestDto
) => {
  return async () => {
    const query = getInvestorGoalDetailsQuery(params);
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };
};

async function fetchInvestorGoalDetails(
  args: InvestorGetGoalDetailsApiRequestDto
) {
  const goalsApi = new TransactInvestorAuthenticatedGoalsApi();
  const res = await goalsApi.getInvestorGoalDetails(args);
  return res.data;
}
export default useGetInvestorGoalDetails;
