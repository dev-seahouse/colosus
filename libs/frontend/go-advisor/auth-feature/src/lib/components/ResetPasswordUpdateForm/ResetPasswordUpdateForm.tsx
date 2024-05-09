import {
  Stack,
  Button,
  Box,
  Form,
  PasswordField,
  PasswordChecklist,
} from '@bambu/react-ui';
import type { FieldErrors, FieldNamesMarkedBoolean } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Heading from '../Heading/Heading';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useResetPassword } from '../../hooks/useResetPassword/useResetPassword';

const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
);

const choosePasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password does not meet requirements')
      .regex(PASSWORD_REGEX),
    repeatPassword: z.string(),
  })
  .refine(({ password, repeatPassword }) => password === repeatPassword, {
    message: 'Repeat password must match your selected password',
    path: ['repeatPassword'],
  });

export type ResetPasswordUpdateFormState = z.infer<
  typeof choosePasswordFormSchema
>;

const getPasswordErrorMessage = (
  dirtyFields: FieldNamesMarkedBoolean<ResetPasswordUpdateFormState>,
  errors: FieldErrors<ResetPasswordUpdateFormState>
) => {
  // when field is dirty , hide error message because 'password checklist' will display error message
  if (dirtyFields.password) return null;
  // when field is not dirty:
  // 1. if input is empty, return the message
  // 2. if there is no error, return null
  return errors.password?.message ?? null;
};

export function ResetPasswordUpdateForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<ResetPasswordUpdateFormState>({
    resolver: zodResolver(choosePasswordFormSchema),
    mode: 'onTouched',
  });
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username') as string;
  const navigate = useNavigate();
  const { mutate } = useResetPassword({
    onSuccess: () => navigate('/reset-password-success'),
  });

  const onSubmit = ({ password }: ResetPasswordUpdateFormState) => {
    const otp = searchParams.get('otp') as string;

    mutate({
      username,
      newPassword: password,
      otp,
    });
  };

  return (
    <Form id="reset-password-update-form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Heading
          title="Choose a new password"
          subtitle={
            <Stack direction={'row'} spacing={0.5} component="span">
              <PersonOutlineIcon />
              <span>
                Account: <b>{username}</b>
              </span>
            </Stack>
          }
        />
        <Stack spacing={2}>
          <PasswordField
            {...register('password', { deps: ['repeatPassword'] })}
            label="New password"
            error={!!errors?.password}
            helperText={getPasswordErrorMessage(dirtyFields, errors)}
            inputProps={{
              'data-testid': 'password-input',
              id: 'password-input',
            }}
            InputLabelProps={{
              htmlFor: 'password-input',
            }}
          />

          {!!dirtyFields.password && (
            <Box pl="3px">
              <PasswordChecklist
                value={getValues('password')}
                valueAgain={getValues('repeatPassword')}
              />
            </Box>
          )}

          <PasswordField
            {...register('repeatPassword', {
              deps: ['password, repeatPassword'],
            })}
            label="Repeat new password"
            error={!!errors?.repeatPassword}
            helperText={errors?.repeatPassword?.message}
            inputProps={{
              'data-testid': 'repeat-password-input',
              id: 'repeat-password-input',
            }}
            InputLabelProps={{
              htmlFor: 'repeat-password-input',
            }}
          />
        </Stack>

        <Box>
          <Button type="submit" data-testid="update-password-button">
            Update password
          </Button>
        </Box>
      </Stack>
    </Form>
  );
}

export default ResetPasswordUpdateForm;
