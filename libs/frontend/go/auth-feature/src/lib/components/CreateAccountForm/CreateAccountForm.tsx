import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Form,
  PasswordChecklist,
  PasswordField,
  registerMuiField,
  Stack,
  TextField,
} from '@bambu/react-ui';
import type { FieldError, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import {
  BottomActionLayout,
  PlatformTermsConditionCheckbox,
  useSelectModelPortfolioByRiskProfileId,
  useSelectName,
  useSelectRiskProfileId,
  useSelectSaveLeadPayload,
  useSelectSetUserData,
} from '@bambu/go-core';
import { useSaveLead } from '@bambu/go-engagement-feature';
import type { z } from 'zod';
import createAccountFormSchema from './CreateAccountForm.schema';
import { useNavigate } from 'react-router-dom';
import useCreateAccount from '../../hooks/useCreateAccount/useCreateAccount';
import type { ConnectInvestorSaveLeadRequestDto } from '@bambu/api-client';

type CreateAccountFormInput = z.infer<typeof createAccountFormSchema>;

export interface CreateAccountFormState {
  email?: string;
  password?: string;
  repeatPassword?: string;
  hasAgreed?: boolean;
}

export function CreateAccountForm() {
  const navigate = useNavigate();
  const setUserData = useSelectSetUserData();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    setError,
    watch,
  } = useForm<CreateAccountFormInput>({
    resolver: zodResolver(createAccountFormSchema),
    mode: 'onTouched',
    defaultValues: {
      hasAgreed: false,
    },
  });

  const { email, password } = watch();

  const { mutate: createAccount } = useCreateAccount({
    onSuccess: () => {
      // Store email address in store
      setUserData({ email });
      // For now, if user successfully creates an account, we will redirect user to login screen.
      navigate('../verify-account');
    },
    onError: (err) => {
      setError('email', {
        type: String(err?.response?.status ?? 0),
        message:
          'This email address is already associated with an existing account',
      });
    },
  });

  const { mutate } = useSaveLead({
    onSuccess: () => {
      if (!email || !password) return;
      createAccount({ email, password });
    },
  });

  const riskProfileId = useSelectRiskProfileId();

  const name = useSelectName();
  const { data: modelPortfolio, isSuccess: isModelPortfolioSuccess } =
    useSelectModelPortfolioByRiskProfileId({
      riskProfileId: riskProfileId ?? '',
    });

  const leadData = useSelectSaveLeadPayload();
  if (!modelPortfolio?.id) return;
  if (
    !isModelPortfolioSuccess ||
    typeof modelPortfolio?.id !== 'string' ||
    !name
  ) {
    return;
  }

  const onSubmit: SubmitHandler<CreateAccountFormState> = (data) => {
    const leadsDataPayload: ConnectInvestorSaveLeadRequestDto = {
      zipCode: '111111',
      riskAppetite: modelPortfolio.id ?? '',
      name,
      email: email ?? '',
      phoneNumber: '12345678',
      notes: '',
      sendAppointmentEmail: false,
      sendGoalProjectionEmail: false,
      computedRiskProfile: {
        riskProfileId,
        riskAppetite: modelPortfolio?.id,
      },
      ...leadData,
    };
    mutate(leadsDataPayload);
  };

  const getEmailErrorMessage = (
    fieldError?: FieldError,
    createAccountError?: { message: string }
  ) => {
    if (fieldError) {
      return fieldError.message;
    }
    if (createAccountError) {
      return 'This email address is already associated with an existing account';
    }
    return '';
  };

  return (
    <Form
      id="create-account-form"
      data-testid="create-account-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={2}>
        <Typography variant="h1" gutterBottom>
          Let&apos;s secure your account
        </Typography>
        <Stack spacing={2}>
          <TextField
            {...registerMuiField(register('email'))}
            label="Email address"
            type="email"
            error={!!errors.email}
            helperText={getEmailErrorMessage(errors?.email)}
          />

          <PasswordField
            {...registerMuiField(register('password'))}
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {!!dirtyFields.password && (
            <PasswordChecklist
              value={watch('password')}
              valueAgain={watch('repeatPassword')}
            />
          )}

          <PasswordField
            {...registerMuiField(register('repeatPassword'))}
            label="Repeat password"
            error={!!errors.repeatPassword}
            helperText={errors.repeatPassword?.message}
          />

          <Box px={'12px'}>
            <PlatformTermsConditionCheckbox
              name="hasAgreed"
              control={control}
            />
          </Box>
        </Stack>
        <BottomActionLayout>
          <Box display="flex" justifyContent={'center'} width="100%">
            <Button
              type="submit"
              sx={{ width: ['100%', 'auto'], marginLeft: ['', 'auto'] }}
            >
              Next
            </Button>
          </Box>
        </BottomActionLayout>
      </Stack>
    </Form>
  );
}

export default CreateAccountForm;
