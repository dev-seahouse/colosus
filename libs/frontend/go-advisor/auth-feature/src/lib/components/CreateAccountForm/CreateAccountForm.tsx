import {
  Box,
  Button,
  Checkbox,
  Form,
  FormControl,
  PasswordField,
  Stack,
  TextField,
  Typography,
  PasswordChecklist,
} from '@bambu/react-ui';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelectSetRefreshToken } from '@bambu/api-client';
import DisclaimerLink from '../DisclaimerLink/DisclaimerLink';
import Heading from '../Heading/Heading';
import LoginLink from '../LoginLink/LoginLink';
import useCreateAccount from '../../hooks/useCreateAccount/useCreateAccount';

const createAccountFormSchema = z
  .object({
    username: z.string().email('Please provide a valid email address'),
    password: z
      .string()
      .min(1, 'Password does not meet requirements')
      .regex(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
        )
      ),
    repeatPassword: z.string().min(1, 'Passwords do not match'),
    isAgreed: z.literal(true, {
      errorMap: () => ({
        message: 'Please acknowledge the above agreement to use this service',
      }),
    }),
    enableMarketing: z.boolean().optional(),
  })
  .partial()
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });

export interface CreateAccountFormState {
  username: string;
  password: string;
  repeatPassword: string;
  isAgreed: boolean;
  enableMarketing?: boolean;
}

export function CreateAccountForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
    getValues,
    setError,
  } = useForm<CreateAccountFormState>({
    resolver: zodResolver(createAccountFormSchema),
    mode: 'onTouched',
    defaultValues: {
      isAgreed: false,
      enableMarketing: false,
    },
  });
  const [searchParams] = useSearchParams();
  const marketingProductTypeInterest = searchParams.get('marketing') as string;

  const navigate = useNavigate();
  const setRefreshToken = useSelectSetRefreshToken();
  const { mutate, isLoading } = useCreateAccount({
    onSuccess: ({ refresh_token, refresh_expires_in }) => {
      setRefreshToken({
        refreshToken: refresh_token,
        refreshTokenExpiresAt: refresh_expires_in,
      });
      const username = getValues('username');
      const queryParams = marketingProductTypeInterest
        ? `&marketing=${marketingProductTypeInterest}`
        : '';
      navigate(
        `/create-account-verify?username=${encodeURIComponent(
          username
        )}${queryParams}`
      );
    },
    onError: (err) => {
      setError('username', {
        type: String(err?.response?.status ?? 0),
        message:
          'This email address is already associated with an existing account',
      });
    },
  });

  const onSubmit = ({
    username,
    password,
    enableMarketing,
  }: CreateAccountFormState) => mutate({ username, password, enableMarketing });

  return (
    <Form
      id="create-account-form"
      data-testid="create-account-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={4}>
        <Stack spacing={3}>
          <Heading
            title="Sign up to create your own
robo-advisor"
          />
          <Stack spacing={2}>
            <TextField
              {...register('username')}
              inputProps={{
                'data-testid': 'business-email-input',
                id: 'business-email-input',
              }}
              InputLabelProps={{
                htmlFor: 'business-email-input',
              }}
              label="Business email address"
              error={!!errors.username}
              helperText={errors.username?.message}
              FormHelperTextProps={{
                id: 'input-business-email-error',
              }}
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
              error={!!errors.password}
              helperText={
                dirtyFields.password ? null : errors.password?.message
              }
              FormHelperTextProps={{
                id: 'input-password-error',
              }}
            />
            {!!dirtyFields.password && (
              <PasswordChecklist
                value={watch('password')}
                valueAgain={watch('repeatPassword')}
              />
            )}
          </Stack>
          <PasswordField
            {...register('repeatPassword')}
            inputProps={{
              'data-testid': 'repeat-password-input',
              id: 'repeat-password-input',
            }}
            InputLabelProps={{
              htmlFor: 'repeat-password-input',
            }}
            label="Repeat password"
            error={!!errors.repeatPassword}
            helperText={errors.repeatPassword?.message}
            FormHelperTextProps={{
              id: 'input-repeat-password-error',
            }}
          />
        </Stack>
        <Stack spacing={2}>
          <Controller
            name="isAgreed"
            control={control}
            render={({ field }) => (
              <DisclaimerLink
                field={{
                  ...field,
                  inputProps: {
                    'data-testid': 'is-agreed-chkbox',
                  },
                }}
                error={!!errors.isAgreed}
                helperText={errors.isAgreed?.message}
              />
            )}
          />
          <Controller
            name="enableMarketing"
            control={control}
            render={({ field }) => (
              <FormControl>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Checkbox
                    id="checkbox-marketing-consent"
                    onChange={field.onChange}
                    value={field.value}
                  />
                  <Typography variant="body2">
                    I agree to receive marketing materials from Bambu
                  </Typography>
                </Box>
              </FormControl>
            )}
          />
        </Stack>
        <Box>
          <Button
            isLoading={isLoading}
            type="submit"
            data-testid="create-account-btn"
          >
            Create my account
          </Button>
        </Box>
        <Stack>
          <LoginLink />
        </Stack>
      </Stack>
    </Form>
  );
}

export default CreateAccountForm;
