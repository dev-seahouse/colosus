import { useSearchParams } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';

const SUCCESSFUL_PAYMENT_PARAM = 'successful_payment';
const SESSION_ID_PARAM = 'session_id';

export const usePaymentDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const successfulPaymentParam = searchParams.get(SUCCESSFUL_PAYMENT_PARAM);
  const [open, setOpen] = useState(successfulPaymentParam === 'true');

  const handleClosePaymentDialog = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (successfulPaymentParam !== null) {
      searchParams.delete(SUCCESSFUL_PAYMENT_PARAM);
      searchParams.delete(SESSION_ID_PARAM);
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, successfulPaymentParam]);

  return { open, handleClosePaymentDialog };
};

export default usePaymentDialog;
