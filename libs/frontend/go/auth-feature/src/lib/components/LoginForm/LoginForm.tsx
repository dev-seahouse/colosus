import {
  Button,
  Form,
  PasswordField,
  registerMuiField,
  Stack,
  Link,
  TextField,
} from '@bambu/react-ui';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useSelectSetApiCredentials } from '@bambu/api-client';
import { useNavigate } from 'react-router-dom';

import { Heading } from '@bambu/go-advisor-core';
import { Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from './LoginForm.schema';
import useLogin from '../../hooks/useLogin/useLogin';
import ServerErrorMessage from './ServerErrorMessage';

type LoginFormInput = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const setApiCredentials = useSelectSetApiCredentials();

  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit: RFFHandleSubmit,
    setError,
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { mutate, isError, isLoading } = useLogin();
  // TODO: remember user last visited route in authenticated route

  const handleSubmit = RFFHandleSubmit((data: LoginFormInput) => {
    mutate(data, {
      onSuccess: ({
        access_token,
        refresh_token,
        refresh_expires_in,
        expires_in,
      }) => {
        setApiCredentials({
          accessToken: access_token,
          accessTokenExpiresAt: expires_in,
          refreshToken: refresh_token,
          refreshTokenExpiresAt: refresh_expires_in,
        });
        navigate('../dashboard');
        // Navigate to investor dashboard
        // navigate('../dashboard-feature')
      },
      onError: (err) => {
        setError('root.serverError', {
          type: String(err?.response?.status ?? 0),
        });
      },
    });
  });

  return (
    <Form id="login-form" datatest-id="login-form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Heading title={'Log in to your account'} />
        <Stack spacing={2}>
          <TextField
            {...registerMuiField(register('username'))}
            label="Email address"
            type={'email'}
            error={!!errors.username || isError}
            helperText={errors.username?.message}
          />
          <PasswordField
            {...registerMuiField(register('password'))}
            label="Password"
            error={!!errors.password || isError}
            helperText={errors.password?.message}
          />
          <ServerErrorMessage statusCode={errors?.root?.serverError?.type} />
          {/* <Link to="/forgot-password">Forgot password?</Link> */}
        </Stack>
        <Stack spacing={4} alignItems={'flex-start'}>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Login
          </Button>
          <Typography variant="body1">
            Don’t have an account?{' '}
            <Link to="/getting-to-know-you/name">Get started</Link>
          </Typography>
        </Stack>
      </Stack>
    </Form>
  );
}

export default LoginForm;
