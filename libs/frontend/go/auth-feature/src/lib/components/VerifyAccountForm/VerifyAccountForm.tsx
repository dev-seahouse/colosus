import { useEffect } from 'react';
import {
  Stack,
  TextField,
  Button,
  Box,
  Form,
  enqueueSnackbar,
  // enqueueSnackbar,
} from '@bambu/react-ui';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

import useVerifyAccount from '../../hooks/useVerifyAccount/useVerifyAccount';
import { BottomActionLayout, Heading, useSelectEmail } from '@bambu/go-core';
import ResendCodeLink from '../ResendCodeLink/ResendCodeLink';
import BackToCreateAccountLink from '../BackToCreateAccountLink/BackToCreateAccountLink';

const verifyAccountFormSchema = z
  .object({
    verificationCode: z.string().trim().min(1, 'Verification code required.'),
  })
  .required();

export type VerifyAccountFormState = z.infer<typeof verifyAccountFormSchema>;

export function VerifyAccountForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VerifyAccountFormState>({
    resolver: zodResolver(verifyAccountFormSchema),
    mode: 'onTouched',
  });
  const navigate = useNavigate();
  const { mutate, isError } = useVerifyAccount({
    onSuccess: () => navigate('../login'),
    onError: (err) => enqueueSnackbar(err.message, { variant: 'error' }),
  });

  const investorEmail = useSelectEmail() ?? '-';

  const handleSetVerificationError = useCallback(
    () =>
      setError('verificationCode', {
        message: 'Please provide a valid verification code',
      }),
    [setError]
  );

  useEffect(() => {
    if (isError) {
      handleSetVerificationError();
    }
  }, [isError, handleSetVerificationError]);

  const onSubmit: SubmitHandler<VerifyAccountFormState> = (data) => {
    // if account verified successfully, navigate to investor w robo/w advisor dashboard
    const { verificationCode } = data;
    const otp = verificationCode;
    mutate({ otp, username: investorEmail });
  };

  return (
    <Form
      id="verify-account-form"
      data-testid="verify-account-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={3}>
        <Heading
          title="Verify your account"
          subtitle={
            <>
              We sent a 6-digit verification code to <br />
              {investorEmail}
            </>
          }
        />
        <TextField
          {...register('verificationCode')}
          inputProps={{
            'data-testid': 'verification-code-input',
            id: 'verification-code-input',
          }}
          InputLabelProps={{
            htmlFor: 'verification-code-input',
          }}
          label="Enter code"
          error={!!errors.verificationCode}
          helperText={errors.verificationCode?.message}
        />
        <ResendCodeLink />
        <BackToCreateAccountLink />
        <BottomActionLayout>
          <Box display="flex" justifyContent={'center'} width="100%">
            <Button type="submit" sx={{ width: { xs: '100%', md: 'auto' } }}>
              Verify
            </Button>
          </Box>
        </BottomActionLayout>
      </Stack>
    </Form>
  );
}

export default VerifyAccountForm;
