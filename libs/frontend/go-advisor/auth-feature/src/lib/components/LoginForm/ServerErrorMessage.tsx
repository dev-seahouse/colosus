import { FormControl, FormHelperText } from '@bambu/react-ui';

import VerifyEmailAddressButton from './VerifyEmailAddressButton';

export interface ServerErrorMessageProps {
  statusCode?: string | number;
}

export function ServerErrorMessage({ statusCode }: ServerErrorMessageProps) {
  if (!statusCode) {
    return null;
  }

  const stringifiedStatusCode = String(statusCode);

  if (stringifiedStatusCode === '409') {
    return (
      <FormControl sx={{ gap: 1 }}>
        <FormHelperText data-testid="unverified-account-error-message" error>
          Your email is not verified. We are unable to process your login
          request until your email address has been successfully verified.
        </FormHelperText>
        <VerifyEmailAddressButton />
      </FormControl>
    );
  }

  return (
    <FormControl>
      <FormHelperText data-testid="credentials-error-message" error>
        Your login credentials are invalid. Please ensure you have entered the
        correct email address and password.
      </FormHelperText>
    </FormControl>
  );
}

export default ServerErrorMessage;
