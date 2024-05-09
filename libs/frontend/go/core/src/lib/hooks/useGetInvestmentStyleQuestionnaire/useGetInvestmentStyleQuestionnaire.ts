import { QueryClient, useQuery } from '@tanstack/react-query';
import {
  ConnectInvestorRiskProfilingApi,
  ConnectGetInvestorRiskQuestionnaireResponseDto,
} from '@bambu/api-client';

export const getInvestmentStyleQuestionnaireQuery = () => ({
  queryKey: ['getInvestmentStyleQuestionnaire'],
  queryFn: async () => {
    const connectInvestorRiskProfilingApi =
      new ConnectInvestorRiskProfilingApi();
    const res =
      await connectInvestorRiskProfilingApi.getInvestorRiskQuestionnaire();

    return res.data;
  },
  staleTime: 1000 * 59 * 5,
});

export const getInvestmentStyleQuestionnaireLoader =
  (queryClient: QueryClient) => async () => {
    return await queryClient.ensureQueryData(
      getInvestmentStyleQuestionnaireQuery()
    );
  };

/**
 * hook to get investment style questionnaire
 */
export const useGetInvestmentStyleQuestionnaire = <T>({
  initialData,
  select,
}: {
  initialData?: ConnectGetInvestorRiskQuestionnaireResponseDto;
  select?: (data: ConnectGetInvestorRiskQuestionnaireResponseDto) => T;
} = {}) => {
  return useQuery({
    ...getInvestmentStyleQuestionnaireQuery(),
    initialData,
    select,
  });
};

export default useGetInvestmentStyleQuestionnaire;
