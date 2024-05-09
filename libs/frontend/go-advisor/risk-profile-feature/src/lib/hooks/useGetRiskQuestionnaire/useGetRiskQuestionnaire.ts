import {
  ConnectAdvisorGetQuestionnaireResponseDto,
  ConnectAdvisorRiskProfilingApi,
} from '@bambu/api-client';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

export interface UseGetQuestionnareOptions {
  initialData?: Partial<ConnectAdvisorGetQuestionnaireResponseDto>;
}

export const getRiskQuestionnaireQuery = {
  queryKey: ['getRiskQuestionnaire'],
  queryFn: fetchRiskQuestionnaire,
};

export const getRiskQuestionnaireLoader =
  (queryClient: QueryClient) =>
  async (): Promise<ConnectAdvisorGetQuestionnaireResponseDto> => {
    const query = getRiskQuestionnaireQuery;

    // ⬇️ return data or fetch it
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };
export function useGetRiskQuestionnaire({
  initialData,
}: UseGetQuestionnareOptions = {}) {
  return useQuery({
    ...getRiskQuestionnaireQuery,
    initialData,
  });
}

async function fetchRiskQuestionnaire() {
  const api = new ConnectAdvisorRiskProfilingApi();
  const res = await api.getRiskQuestionnaire();
  return res.data;
}

export default useGetRiskQuestionnaire;
