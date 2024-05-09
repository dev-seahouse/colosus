import {
  Box,
  Button,
  closeSnackbar,
  enqueueSnackbar,
  Form,
  MuiLink,
  SnackbarCloseButton,
  Stack,
} from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import RoboManagementFeeSettings from '../RoboManagementFeeSettingsForm/RoboManagementFeeSettings';
import PortfolioRebalancingForm from '../PortfolioRebalancingForm/PortfolioRebalancingForm';
import { settingsFormSchema } from '../SettingForm.schema';
import { useSaveAdvisorBankAccountDetails } from '../../hooks/useSaveAdvisorBankAccount/useSaveAdvisorBankAccount';
import { useUpdateAdvisorBankAccountDetails } from '../../hooks/useUpdateAdvisorBankAccount/useUpdateAdvisorBankAccount';
import useGetAdvisorBankAccountDetails from '../../hooks/useGetAdvisorBankAccount/useGetAdvisorBankAccount';
import { hasNoAdvisorBankAccountFoundError } from '@bambu/api-client';
import { useQueryClient } from '@tanstack/react-query';

export type SettingsFormState = z.infer<typeof settingsFormSchema>;

export function SettingsForm() {
  const { data: advisorBankDetails, isLoading } =
    useGetAdvisorBankAccountDetails({
      retry: (count, error) => {
        if (hasNoAdvisorBankAccountFoundError(error)) return false;
        return count <= 3;
      },
    });

  const methods = useForm<SettingsFormState>({
    mode: 'onTouched',
    resolver: zodResolver(settingsFormSchema),
    values: {
      annualManagementFee:
        parseFloat(advisorBankDetails?.annualManagementFee ?? '0') ?? 0,
      accountNumber: advisorBankDetails?.accountNumber ?? '',
      accountName: advisorBankDetails?.accountName ?? '',
      sortCode: advisorBankDetails?.sortCode ?? '',
    },
  });

  const queryClient = useQueryClient();
  const { mutate, isLoading: saveAdvisorBankDetailsLoading } =
    useSaveAdvisorBankAccountDetails();
  const {
    mutate: updateBankAccountDetails,
    isLoading: updateAdvisorBankDetailsLoading,
  } = useUpdateAdvisorBankAccountDetails();

  const navigate = useNavigate();

  const triggerSnackbar = () =>
    enqueueSnackbar({
      variant: 'success',
      message: 'Content saved!',
      action: (snackbarId) => (
        <Box display="flex" sx={{ gap: 1 }}>
          <MuiLink
            component="button"
            onClick={() => {
              closeSnackbar(snackbarId);
              navigate('../home');
            }}
          >
            Go to dashboard
          </MuiLink>
          <SnackbarCloseButton snackbarKey={snackbarId} />
        </Box>
      ),
    });

  const onSubmit = methods.handleSubmit((data) => {
    const { sortCode, annualManagementFee, accountName, accountNumber } = data;
    const roboManagementFeeData = {
      annualManagementFee: annualManagementFee.toString(),
      accountName,
      accountNumber,
      sortCode,
    };

    if (advisorBankDetails) {
      updateBankAccountDetails(roboManagementFeeData, {
        onSuccess: () => {
          triggerSnackbar();
        },
        onSettled: async () => {
          return queryClient.invalidateQueries({
            queryKey: ['getAdvisorBankAccountDetails'],
          });
        },
      });
    }

    mutate(roboManagementFeeData);
    return triggerSnackbar();
  });

  return (
    <FormProvider {...methods}>
      <Form onSubmit={onSubmit} id="settings-form" data-testid="settings-form">
        <Stack spacing={3}>
          <RoboManagementFeeSettings />
          <PortfolioRebalancingForm />
          <Box>
            <Button
              type="submit"
              disabled={
                !!updateAdvisorBankDetailsLoading ||
                !!saveAdvisorBankDetailsLoading
              }
            >
              Use this configuration
            </Button>
          </Box>
        </Stack>
      </Form>
    </FormProvider>
  );
}

export default SettingsForm;
