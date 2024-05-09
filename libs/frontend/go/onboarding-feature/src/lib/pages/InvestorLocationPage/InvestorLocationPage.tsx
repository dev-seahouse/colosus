import { useEffect } from 'react';

import LocationForm from '../../components/LocationForm/LocationForm';
import { useSelectSetShowBackButton } from '@bambu/go-core';

export function InvestorLocationPage() {
  // const resetLayoutState = useSelectResetLayoutState();
  const showBackButton = useSelectSetShowBackButton();
  useEffect(() => {
    showBackButton(true);
    // resetLayoutState();
  }, [showBackButton]);

  return <LocationForm />;
}

export default InvestorLocationPage;
