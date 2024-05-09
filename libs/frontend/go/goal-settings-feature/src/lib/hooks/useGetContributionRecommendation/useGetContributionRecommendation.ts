import { getModelPortfoliosLoader } from '@bambu/go-core';
import {
  useQueryClient,
  type QueryClient,
  useQuery,
} from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import {
  composeAvailablePortfolios,
  composeInputs,
  getDefaultRecommendationSelection,
} from '../useGetOptimizedProjection/useGetOptimizedProjection.utils';
import type { GetProjectionsResponseDto } from '@bambu/api-client';
import { BambuApiLibraryIntegrationGraphApi } from '@bambu/api-client';

export type GetContributionRecommendationData = GetProjectionsResponseDto;
export interface GetContributionRecommendationArgs {
  inputInitialInvestment: number;
  inputMonthlyContribution: number;
}

// TODO: handle grossGoalAmount for growing wealth(connect+transact) flow
const getContributionRecommendationQuery = (
  queryClient: QueryClient,
  args: GetContributionRecommendationArgs = {
    inputInitialInvestment: 0,
    inputMonthlyContribution: 0,
  }
) => ({
  queryKey: [
    'getContributionRecommendation',
    args.inputInitialInvestment,
    args.inputMonthlyContribution,
  ],
  queryFn: async () => {
    const bambuApiLibraryIntegrationGraphApi =
      new BambuApiLibraryIntegrationGraphApi();
    const modelPortfolios = await getModelPortfoliosLoader(queryClient)();
    const availablePortfolios = composeAvailablePortfolios(modelPortfolios);

    const res = await bambuApiLibraryIntegrationGraphApi.getProjections({
      availablePortfolios,
      inputs: {
        ...composeInputs(modelPortfolios),
        infusions: [args.inputMonthlyContribution ?? 0],
        grossInitialInvestment: args.inputInitialInvestment ?? 0,
      },
      recommendationSelection: getDefaultRecommendationSelection(),
    });
    return res.data;
  },
  staleTime: 1000,
});

export const getContributionRecommendationLader =
  (queryClient: QueryClient) =>
  async (): Promise<GetContributionRecommendationData> => {
    const query = getContributionRecommendationQuery(queryClient);
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export function useGetContributionRecommendation({
  initialData,
  args,
  enabled = true,
}: {
  initialData?: Partial<GetContributionRecommendationData>;
  args: GetContributionRecommendationArgs;
  enabled?: UseQueryOptions['enabled'];
}) {
  const queryClient = useQueryClient();
  return useQuery({
    ...getContributionRecommendationQuery(queryClient, args),
    initialData,
    enabled,
  });
}

export default useGetContributionRecommendation;
