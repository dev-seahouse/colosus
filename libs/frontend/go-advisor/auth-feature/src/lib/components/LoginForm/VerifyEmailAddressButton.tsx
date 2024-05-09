import { MuiLink, FormHelperText } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { LoginFormState } from './LoginForm';
import useResendOtp from '../../hooks/useResendOtp/useResendOtp';

export const VerifyEmailAddressButton = () => {
  const { getValues } = useFormContext<LoginFormState>();
  const { mutate } = useResendOtp();
  const navigate = useNavigate();

  const onClick = () => {
    const username = getValues('username');

    mutate(
      { email: username },
      {
        onSuccess: () =>
          navigate(
            `/create-account-verify?username=${encodeURIComponent(username)}`
          ),
      }
    );
  };

  return (
    <FormHelperText sx={{ display: 'inline-flex', gap: 0.5 }}>
      Click here to
      <MuiLink component="button" onClick={onClick} type="button">
        verify your email address
      </MuiLink>
    </FormHelperText>
  );
};

export default VerifyEmailAddressButton;
