import { Stack, TextField, Button, Box, Form } from '@bambu/react-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

import Heading from '../Heading/Heading';
import LoginLink from '../LoginLink/LoginLink';
import useSendResetPasswordEmail from '../../hooks/useSendResetPasswordEmail/useSendResetPasswordEmail';
import { useSelectSetResetPasswordUsername } from '../../store/useAuthStore.selectors';

const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, 'An email address is required')
      .email('Please enter a valid email address'),
  })
  .required();

export type ResetPasswordFormState = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ResetPasswordFormState>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
  });
  const setResetPasswordUsername = useSelectSetResetPasswordUsername();

  const navigate = useNavigate();
  const { mutate, isLoading } = useSendResetPasswordEmail({
    onSuccess: () => {
      setResetPasswordUsername(getValues('email'));
      navigate('/reset-password-instruction');
    },
  });

  const onSubmit = (data: ResetPasswordFormState) => {
    mutate(data);
  };

  return (
    <Form id="reset-password-form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Stack spacing={3}>
          <Heading
            title="Reset your password"
            subtitle="Enter your email address below and we'll send you a link to reset your password."
          />

          <Stack spacing={3}>
            <TextField
              {...register('email')}
              label="Email Address"
              error={!!errors?.email}
              helperText={errors?.email?.message}
              inputProps={{
                'data-testid': 'email-input',
                id: 'email-input',
              }}
              InputLabelProps={{
                htmlFor: 'email-input',
              }}
            />

            <Box>
              <Button
                isLoading={isLoading}
                type="submit"
                data-testid="send-request-button"
              >
                Send Request
              </Button>
            </Box>

            <Box>
              <LoginLink label="" linkText="Back to Login" />
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Form>
  );
}

export default ResetPasswordForm;
