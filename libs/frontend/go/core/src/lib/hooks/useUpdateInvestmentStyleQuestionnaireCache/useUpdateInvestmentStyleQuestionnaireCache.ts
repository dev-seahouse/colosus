import { useQueryClient } from '@tanstack/react-query';
import { getInvestmentStyleQuestionnaireQuery } from '../useGetInvestmentStyleQuestionnaire/useGetInvestmentStyleQuestionnaire';
import { ConnectGetInvestorRiskQuestionnaireResponseDto } from '@bambu/api-client';

export function useUpdateInvestmentStyleQuestionnaireCache() {
  const queryClient = useQueryClient();
  const query = getInvestmentStyleQuestionnaireQuery();

  return (overrideData: ConnectGetInvestorRiskQuestionnaireResponseDto) => {
    queryClient.setQueryData(query.queryKey, (oldData) =>
      oldData ? { ...oldData, ...overrideData } : overrideData
    );
  };
}
