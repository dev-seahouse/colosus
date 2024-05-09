import { useSelectResetLayoutState } from '@bambu/go-core';
import NameForm from '../../components/NameForm/NameForm';
import { useEffect } from 'react';

export function InvestorNamePage() {
  const resetLayoutState = useSelectResetLayoutState();
  useEffect(() => {
    resetLayoutState();
    // resetLayoutState();
  }, [resetLayoutState]);

  return <NameForm />;
}

export default InvestorNamePage;
