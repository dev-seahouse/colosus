import type { ReactQueryLoaderData } from '@bambu/go-core';
import { useSelectSetProgress } from '@bambu/go-core';
import { useCallback, useEffect } from 'react';
import InvestmentStyleList from '../../components/InvestmentStyleList/InvestmentStyleList';

import { useSelectSetShowBackButton } from '@bambu/go-core';
import type { getInvestorRiskProfilesLoader } from '@bambu/go-goal-settings-feature';

export function InvestorInvestmentStylePage({
  initialData,
}: {
  initialData?: ReactQueryLoaderData<typeof getInvestorRiskProfilesLoader>;
}) {
  const setShowBackButton = useSelectSetShowBackButton();

  const setProgress = useSelectSetProgress();

  const handleSetInvestorInvestmentStylePageLayout = useCallback(() => {
    setProgress(50);
    setShowBackButton(false);
  }, [setProgress, setShowBackButton]);

  useEffect(() => {
    handleSetInvestorInvestmentStylePageLayout();
  }, [handleSetInvestorInvestmentStylePageLayout]);

  return <InvestmentStyleList />;
}

export default InvestorInvestmentStylePage;
