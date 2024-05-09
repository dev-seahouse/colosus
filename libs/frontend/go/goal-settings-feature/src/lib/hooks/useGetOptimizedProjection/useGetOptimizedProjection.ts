import type { QueryClient } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { GetProjectionsResponseDto } from '@bambu/api-client';
import { BambuApiLibraryIntegrationGraphApi } from '@bambu/api-client';
import { getModelPortfoliosLoader, useCoreStore } from '@bambu/go-core';
import {
  composeAvailablePortfolios,
  composeInputs,
  getDefaultRecommendationSelection,
} from './useGetOptimizedProjection.utils';

export type GetOptimizedProjectionData = GetProjectionsResponseDto;

// TODO: this is wrong , it will result in infinite loop if api returns error
// the correct way of calling dependent query is to use useQueries
export const getOptimizedProjectionQuery = (queryClient: QueryClient) => ({
  queryKey: ['getOptimizedProjection'],
  queryFn: async () => {
    const { goal } = useCoreStore.getState();
    if (!goal) throw new Error('Goal not found.');

    const modelPortfolios = await getModelPortfoliosLoader(queryClient)();
    const availablePortfolios = composeAvailablePortfolios(modelPortfolios);
    const recommendationSelection = getDefaultRecommendationSelection();
    const bambuApiLibraryIntegrationGraphApi =
      new BambuApiLibraryIntegrationGraphApi();

    // first call to get recommended goal value using arbitrary goal target to retrieve recommended goal value for grwoing wealth
    let initialResForGrowMyWealth = null;

    if (goal.goalType === 'Growing Wealth') {
      initialResForGrowMyWealth =
        await bambuApiLibraryIntegrationGraphApi.getProjections({
          availablePortfolios,
          inputs: {
            ...composeInputs(modelPortfolios),
          },
          recommendationSelection,
        });
    }

    if (goal.goalType === 'Growing Wealth') {
      if (!initialResForGrowMyWealth) {
        throw new Error('initialResForGrowMyWealth not found');
      }
      useCoreStore.setState((state) => ({
        goal: {
          ...state.goal,
          goalValue:
            initialResForGrowMyWealth!.data.projections[
              initialResForGrowMyWealth!.data.projections.length - 1
            ].projectionTargetAmt,
        },
      }));
    }

    // second call uses optimized constant infusion to get projections for graph
    // since optimized constant infusion is used, response will always be 'ok'
    // and res.data.recommendations will be empty
    const annualInfusion = (goal.monthlyContribution ?? 0) * 12; // multiply by 12 to get annual infusion
    if (annualInfusion === 0) {
      console.warn('infusion is 0');
    }
    const res = await bambuApiLibraryIntegrationGraphApi.getProjections({
      availablePortfolios,
      inputs: {
        ...composeInputs(modelPortfolios),
        ...(goal.goalType === 'Growing Wealth' && {
          grossGoalAmount:
            initialResForGrowMyWealth!.data.projections[
              initialResForGrowMyWealth!.data.projections.length - 1
            ].projectionTargetAmt,
        }),
        infusions: [annualInfusion],
      },
      recommendationSelection,
    });

    return {
      ...res.data,
    };
  },
});

export const getOptimizedProjectionLoader =
  (queryClient: QueryClient) =>
  async (): Promise<GetOptimizedProjectionData> => {
    const query = getOptimizedProjectionQuery(queryClient);

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export interface UseGetOptimizedProjectionOptions {
  initialData?: Partial<GetOptimizedProjectionData>;
}

/**
 * hook to get country rate data
 */
export const useGetOptimizedProjection = ({
  initialData,
}: UseGetOptimizedProjectionOptions = {}) => {
  const queryClient = useQueryClient();
  return useQuery({
    ...getOptimizedProjectionQuery(queryClient),
    initialData,
  });
};

export default useGetOptimizedProjection;
