import { useSearchParams } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';

const DOMAIN_REGISTERED_PARAM = 'domain_registered';

export const useDomainRegisteredDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const domainRegisteredParam = searchParams.get(DOMAIN_REGISTERED_PARAM);
  const [open, setOpen] = useState(domainRegisteredParam === 'true');

  const handleCloseDomainRegisteredDialog = useCallback(
    () => setOpen(false),
    [setOpen]
  );

  useEffect(() => {
    if (domainRegisteredParam !== null) {
      searchParams.delete(DOMAIN_REGISTERED_PARAM);
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, domainRegisteredParam]);

  return { open, handleCloseDomainRegisteredDialog };
};

export default useDomainRegisteredDialog;
