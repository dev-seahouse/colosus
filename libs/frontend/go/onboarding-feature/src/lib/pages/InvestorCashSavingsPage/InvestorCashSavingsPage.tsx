import {
  useSelectSetShowBackButton,
  useSelectSetProgress,
} from '@bambu/go-core';
import { useCallback, useEffect } from 'react';

import CashSavingsForm from '../../components/CashSavingsForm/CashSavingsForm';

export function InvestorCashSavingsPage() {
  const showBackButton = useSelectSetShowBackButton();
  const setProgress = useSelectSetProgress();
  const handleSetInvestorCashSavingsPageLayout = useCallback(() => {
    setProgress(50);
    showBackButton(true);
  }, [setProgress, showBackButton]);

  useEffect(() => {
    handleSetInvestorCashSavingsPageLayout();
  }, [handleSetInvestorCashSavingsPageLayout]);

  return <CashSavingsForm />;
}

export default InvestorCashSavingsPage;
