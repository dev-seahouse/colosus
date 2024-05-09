import { MuiLink, Typography, enqueueSnackbar } from '@bambu/react-ui';
import useResendOtp from '../../hooks/useResendOtp/useResendOtp';
import { useCountDownTimer } from '@bambu/go-advisor-auth-feature';

import { useSelectEmail } from '@bambu/go-core';

function formatCountDown(seconds: number) {
  const hrs = ~~(seconds / 3600);
  const mins = ~~((seconds % 3600) / 60);
  const secs = ~~seconds % 60;

  let ret = '';
  if (hrs > 0) {
    ret += `${hrs}:${mins < 10 ? '0' : ''}`;
  }
  ret += `${String(mins).padStart(2, '0')}:${secs < 10 ? '0' : ''}`;
  ret += `${secs}`;
  return ret;
}

export function ResendCodeLink() {
  const {
    countDownTime,
    start: startResendCountDown,
    hasStarted,
  } = useCountDownTimer({
    duration: 30, // seconds
  });

  const { mutate } = useResendOtp();

  const investorEmail = useSelectEmail() ?? '-';

  function onReSendClick() {
    mutate(
      { email: investorEmail },
      {
        onSuccess: () => {
          enqueueSnackbar({
            message: 'A new OTP has been sent to your email',
            variant: 'success',
          });
        },
        onSettled: () => startResendCountDown(),
      }
    );
  }

  // Add hooks and countdown timer once apis are ready
  return (
    <Typography variant="body1">
      Did not receive the code?{' '}
      <MuiLink
        component="button"
        type="button"
        sx={{
          pb: '5px',
          '&[disabled]': {
            color: 'grey',
            cursor: 'not-allowed',
          },
        }}
        disabled={hasStarted}
        onClick={onReSendClick}
      >
        Resend{' '}
        {hasStarted && `(available in ${formatCountDown(countDownTime)})`}
      </MuiLink>
    </Typography>
  );
}

export default ResendCodeLink;
