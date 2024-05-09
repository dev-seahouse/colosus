import { Button } from '@bambu/react-ui';

import type { ReactNode } from 'react';

import useCreateBillingPortalSession from '../../hooks/useCreateBillingPortalSession/useCreateBillingPortalSession';

export interface CreateBillingSessionButtonProps {
  label?: ReactNode;
}

export function CreateBillingSessionButton({
  label = 'Create Session',
}: CreateBillingSessionButtonProps) {
  const { mutate, isLoading } = useCreateBillingPortalSession({
    onSuccess: (data) => {
      window.location.href = data.url as string;
    },
  });

  return (
    <Button variant="text" isLoading={isLoading} onClick={() => mutate()}>
      {label}
    </Button>
  );
}

export default CreateBillingSessionButton;
