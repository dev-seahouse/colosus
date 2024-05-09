import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  styled,
  Box,
  lighten,
  Stack,
} from '@bambu/react-ui';
import type { DialogProps } from '@bambu/react-ui';
import {
  useSelectUpdateTenantBrandingDataQuery,
  useSelectUpdateProfileDetailsQuery,
} from '@bambu/go-advisor-core';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react';

import type { PlatformSetupFormState } from '../PlatformSetupForm/PlatformSetupForm';
import useUpdateTradeNameAndSubdomain from '../../hooks/useUpdateTradeNameAndSubdomain/useUpdateTradeNameAndSubdomain';

const SubdomainContainer = styled(Box)(({ theme }) => ({
  backgroundColor: lighten(theme.palette.primary.main, 0.8),
  padding: theme.spacing(2),
}));

export interface SubdomainConfirmationDialogProps
  extends Pick<DialogProps, 'open'> {
  handleClose?: () => void;
}

export function SubdomainConfirmationDialog({
  open = false,
  handleClose,
}: SubdomainConfirmationDialogProps) {
  const { getValues, handleSubmit, setError } =
    useFormContext<PlatformSetupFormState>();
  const subdomain = getValues('subdomain');
  const navigate = useNavigate();
  const updateTenantBrandingData = useSelectUpdateTenantBrandingDataQuery();
  const updateProfileDetails = useSelectUpdateProfileDetailsQuery();
  const { mutate, isLoading, isError } = useUpdateTradeNameAndSubdomain({
    onSuccess: async () => {
      const tradeName = getValues('tradeName');

      // update query cache
      updateTenantBrandingData({ tradeName });
      updateProfileDetails().then(() =>
        navigate('/dashboard/home?domain_registered=true')
      );
    },
  });
  const handleCloseDialogOnError = useCallback(() => {
    setError('subdomain', {
      message:
        'This link is not available. Please try a different robo-advisor link.',
    });
    handleClose?.();
  }, []);
  const onSubmit = handleSubmit((data) => mutate(data));

  useEffect(() => {
    if (isError) {
      handleCloseDialogOnError();
    }
  }, [isError, handleCloseDialogOnError]);

  return (
    <Dialog
      id="subdomain-confirmation-dialog"
      data-testid="subdomain-confirmation-dialog"
      open={open}
    >
      <Box py={3} px={2}>
        <DialogTitle sx={{ fontSize: '2rem' }}>
          Confirm your robo-advisor link
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <SubdomainContainer>
              <Typography variant="h5">{subdomain}.go-bambu.co</Typography>
            </SubdomainContainer>
            <Typography>
              Please note that you won’t be able change this link once you
              confirm.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={onSubmit} isLoading={isLoading}>
            Confirm
          </Button>
          <Button variant="text" onClick={handleClose}>
            No, I want to change
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default SubdomainConfirmationDialog;
