import {
  Box,
  Button,
  FormControlCheckbox,
  registerMuiField,
  Stack,
  TextField,
  Form,
  Typography,
  enqueueSnackbar,
} from '@bambu/react-ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';
import DirectDebitGuaranteeBanner from '../DirectDebitGuaranteeBanner/DirectDebitGuaranteeBanner';
import { useNavigate } from 'react-router-dom';
import directDebitMandateSetupFormSchema from './DirectDebitMadateSetupForm.schema';
import useCreateBankAccount from '../../hooks/useCreateBankAccount/useCreateBankAccount';
import { PatternFormat } from 'react-number-format';
import { getBankAccountsQuery, useAppBar } from '@bambu/go-core';
import { useQueryClient } from '@tanstack/react-query';

type DirectDebitMandateSetupFormValues = z.infer<
  typeof directDebitMandateSetupFormSchema
>;

export function DirectDebitMandateSetupForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { show } = useAppBar();
  const { mutate, isLoading: isLoadingCreateBankAccount } =
    useCreateBankAccount({
      retry: 3,
    });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DirectDebitMandateSetupFormValues>({
    resolver: zodResolver(directDebitMandateSetupFormSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      accountNumber: '',
      isAccountOwner: false,
      hasMultipleOwner: false,
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        accountNumber: data.accountNumber,
        countryCode: 'GB',
        currency: 'GBP',
        name: data.name,
        sortCode: data.sortCode,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              getBankAccountsQuery.queryKey,
              'getDirectDebitMandatePdfPreview',
            ],
          });
          navigate(`/direct-debit-confirm`);
        },
        onError: () => {
          enqueueSnackbar('Something went wrong.', {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });
        },
      }
    );
  });

  return (
    <Form
      id="direct-debit-mandate-form"
      data-testid="direct-debit-mandate-form"
      onSubmit={onSubmit}
    >
      {isLoadingCreateBankAccount && show()}
      <Stack spacing={2}>
        <Typography variant="h2" fontWeight="bold" fontSize="0.875rem">
          Bank account details
        </Typography>
        <Stack spacing={2}>
          <TextField
            {...registerMuiField(register('name'))}
            placeholder={'Enter your name'}
            label={'Name on bank account'}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            {...registerMuiField(register('accountNumber'))}
            placeholder="Enter account number"
            label={'Account number'}
            error={!!errors.accountNumber}
            helperText={errors.accountNumber?.message}
          />
          <Controller
            name={'sortCode'}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <PatternFormat
                format="##-##-##"
                customInput={TextField}
                {...field}
                label="Sort code"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Stack spacing={3}>
            <Controller
              name="isAccountOwner"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControlCheckbox
                  {...field}
                  label={
                    <Typography fontSize={'14px'}>
                      I confirm that I am the account holder and am authorised
                      to set up Direct Debit payments on this account.
                    </Typography>
                  }
                  error={error}
                />
              )}
            />
            <Controller
              name="hasMultipleOwner"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControlCheckbox
                  {...field}
                  label={
                    <Typography fontSize={'14px'}>
                      More than one person required to authorise Direct Debits.
                    </Typography>
                  }
                  error={error}
                />
              )}
            />
            <Box
              py={1}
              display={'flex'}
              justifyContent="center"
              sx={{
                '& > * ': {
                  flexBasis: '350px',
                  maxWidth: '400px',
                  flexGrow: 1,
                },
              }}
            >
              <DirectDebitGuaranteeBanner />
            </Box>
          </Stack>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            position: 'static',
          }}
        >
          <Button
            type="button"
            disabled={isLoadingCreateBankAccount}
            variant="outlined"
            sx={{ flex: [1, 1, 0] }}
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            sx={{ flex: [1, 1, 0] }}
            isLoading={isLoadingCreateBankAccount}
          >
            Continue
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}

export default DirectDebitMandateSetupForm;
