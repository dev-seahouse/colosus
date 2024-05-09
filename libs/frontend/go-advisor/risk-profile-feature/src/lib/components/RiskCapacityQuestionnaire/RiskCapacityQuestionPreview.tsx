import { useUpdateInvestmentStyleQuestionnaireCache } from '@bambu/go-core';
import useGetRiskQuestionnaire from '../../hooks/useGetRiskQuestionnaire/useGetRiskQuestionnaire';
import { ReactNode, useLayoutEffect } from 'react';
import { IGetRiskQuestionnaire } from '@bambu/shared';

export function RiskCapacityQuesionPreview({
  children,
}: {
  children: ReactNode;
}) {
  const { data } = useGetRiskQuestionnaire();
  const updateInvestmentStyleQuestionnaireCache =
    useUpdateInvestmentStyleQuestionnaireCache();

  useLayoutEffect(() => {
    if (!data) return;
    updateInvestmentStyleQuestionnaireCache(data as IGetRiskQuestionnaire);
  }, [data, updateInvestmentStyleQuestionnaireCache]);

  return children;
}
