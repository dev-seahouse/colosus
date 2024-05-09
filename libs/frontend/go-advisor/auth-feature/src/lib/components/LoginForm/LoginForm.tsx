import {
  Stack,
  TextField,
  Button,
  Box,
  Form,
  PasswordField,
} from '@bambu/react-ui';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useSelectSetApiCredentials } from '@bambu/api-client';
import { useGTMLoginEvent } from '@bambu/go-advisor-analytics';

import ServerErrorMessage from './ServerErrorMessage';
import Heading from '../Heading/Heading';
import ForgotPasswordLink from '../ForgotPasswordLink/ForgotPasswordLink';
import CreatePasswordLink from '../CreateAccountLink/CreateAccountLink';
import useLogin from '../../hooks/useLogin/useLogin';
import getUserIdFromJwt from '../../utils/getUserIdFromJwt';

const loginFormSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Please enter a valid email address.')
      .email('Please enter a valid email address.'),
    password: z.string().min(1, 'A password is required.'),
  })
  .required();

export type LoginFormState = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const methods = useForm<LoginFormState>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onTouched',
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = methods;
  const navigate = useNavigate();
  const setApiCredentials = useSelectSetApiCredentials();
  const gtmLoginEvent = useGTMLoginEvent();
  const { mutate, isError, isLoading } = useLogin({});
  const onSubmit = (data: LoginFormState) => {
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

        const userId = getUserIdFromJwt(access_token);
        gtmLoginEvent({ userId });

        navigate('dashboard/home');
      },
      onError: (err) => {
        setError('root.serverError', {
          type: String(err?.response?.status ?? 0),
        });
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <Form
        id="login-form"
        data-testid="login-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={4}>
          <Stack spacing={3}>
            <Heading title="Log in to your account" />
            <Stack spacing={2}>
              <TextField
                {...register('username')}
                inputProps={{
                  'data-testid': 'email-input',
                  id: 'email-input',
                }}
                InputLabelProps={{
                  htmlFor: 'email-input',
                }}
                label="Email Address"
                error={!!errors.username || isError}
                helperText={errors.username?.message}
              />
              <PasswordField
                {...register('password')}
                inputProps={{
                  'data-testid': 'password-input',
                  id: 'password-input',
                }}
                InputLabelProps={{
                  htmlFor: 'password-input',
                }}
                label="Password"
                error={!!errors.password || isError}
                helperText={errors.password?.message}
              />
              <ServerErrorMessage
                statusCode={errors?.root?.serverError?.type}
              />
              <ForgotPasswordLink />
            </Stack>
          </Stack>
          <Stack spacing={2}>
            <Box>
              <Button
                isLoading={isLoading}
                type="submit"
                data-testid="login-btn"
              >
                Log in
              </Button>
            </Box>
            <Stack>
              <CreatePasswordLink />
            </Stack>
          </Stack>
        </Stack>
      </Form>
    </FormProvider>
  );
}

export default LoginForm;
