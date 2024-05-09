import type {
  ReactQueryLoaderData,
  getInvestmentStyleQuestionnaireLoader,
} from '@bambu/go-core';
import {
  useSelectSetShowBackButton,
  useSelectSetProgress,
} from '@bambu/go-core';
import { useEffect, useCallback } from 'react';

import { Await, useLoaderData } from 'react-router-dom';
import AnnualIncomeForm from '../../components/AnnualIncomeForm/AnnualIncomeForm';

export function InvestorAnnualIncomePage() {
  const showBackButton = useSelectSetShowBackButton();
  const setProgress = useSelectSetProgress();
  const { investmentStyleQuestionnaire } =
    (useLoaderData() as {
      investmentStyleQuestionnaire: ReactQueryLoaderData<
        typeof getInvestmentStyleQuestionnaireLoader
      >;
    }) ?? {}; // ?? {} is a fallback in case the data is undefined for preview

  const handleSetInvestorAnnualIncomeLayout = useCallback(() => {
    setProgress(50);
    showBackButton(true);
  }, [setProgress, showBackButton]);

  useEffect(() => {
    handleSetInvestorAnnualIncomeLayout();
  }, [handleSetInvestorAnnualIncomeLayout]);

  return (
    <Await
      resolve={investmentStyleQuestionnaire}
      errorElement={'something went wrong'}
    >
      {(res) => <AnnualIncomeForm initialData={res} />}
    </Await>
  );
}

export default InvestorAnnualIncomePage;
