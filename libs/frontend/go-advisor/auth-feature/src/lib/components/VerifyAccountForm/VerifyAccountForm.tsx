import {
  Stack,
  TextField,
  Button,
  Box,
  Form,
  enqueueSnackbar,
} from '@bambu/react-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useCallback } from 'react';

import Heading from '../Heading/Heading';
import ResendCodeLink from '../ResendCodeLink/ResendCodeLink';
import BackToCreateAccountLink from '../BackToCreateAccountLink/BackToCreateAccountLink';
import useVerifyEmailInitial from '../../hooks/useVerifyEmailInitial/useVerifyEmailInitial';
import useGetUsernameFromParams from '../../hooks/useGetUsernameFromParams/useGetUsernameFromParams';
import { selectRefreshToken } from '@bambu/api-client';

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
  const refreshToken = selectRefreshToken();
  const [searchParams] = useSearchParams();
  const marketingProductTypeInterest = searchParams.get('marketing') as string;

  const { mutate, isLoading, isError } = useVerifyEmailInitial({
    onSuccess: () => {
      enqueueSnackbar({
        message: 'Your account has been verified',
        variant: 'success',
      });

      const queryString = marketingProductTypeInterest
        ? `?marketing=${marketingProductTypeInterest}`
        : '';
      navigate(`/dashboard/home${queryString}`);
    },
    onError: (err) => {
      // For the scenario where the user doesn't verify created account immediately and revists and tries to login again without a valid refresh token, navigate them back to the login page after subsequent verification step.
      if (!refreshToken && err?.config?.url?.includes('refresh')) navigate('/');
    },
  });

  const username = useGetUsernameFromParams();
  const handleSetVerificationError = useCallback(
    () =>
      setError('verificationCode', {
        message: 'Please provide a valid verification code',
      }),
    [setError]
  );

  const onSubmit = ({ verificationCode }: VerifyAccountFormState) => {
    mutate({
      username: username.split('?')[0],
      otp: verificationCode,
    });
  };

  useEffect(() => {
    if (isError) {
      handleSetVerificationError();
    }
  }, [isError, handleSetVerificationError]);

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
              <b>{username}</b>
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
        <Box>
          <Button
            isLoading={isLoading}
            type="submit"
            data-testid="verify-account-btn"
          >
            Verify
          </Button>
        </Box>
        <ResendCodeLink />
        <BackToCreateAccountLink />
      </Stack>
    </Form>
  );
}

export default VerifyAccountForm;
