import type {
  ReactQueryLoaderData,
  getInvestmentStyleQuestionnaireLoader,
} from '@bambu/go-core';
import { useSelectSetShowBackButton } from '@bambu/go-core';
import { useEffect } from 'react';

import AgeForm from '../../components/AgeForm/AgeForm';
import { Await, useLoaderData } from 'react-router-dom';

export function InvestorAgePage() {
  const showBackButton = useSelectSetShowBackButton();

  const { investmentStyleQuestionnaire } =
    (useLoaderData() as {
      investmentStyleQuestionnaire: ReactQueryLoaderData<
        typeof getInvestmentStyleQuestionnaireLoader
      >;
    }) ?? {}; // ?? {} is a fallback in case the data is undefined for preview

  useEffect(() => {
    showBackButton(true);
  }, [showBackButton]);

  return (
    <Await resolve={investmentStyleQuestionnaire}>
      {(data) => <AgeForm initialData={data} />}
    </Await>
  );
}

export default InvestorAgePage;
