import { MuiLink, Typography, enqueueSnackbar } from '@bambu/react-ui';
import useCountDownTimer from '../../hooks/useCountDownTimer/useCountDownTimer';
import useResendOtp from '../../hooks/useResendOtp/useResendOtp';
import useGetUsernameFromParams from '../../hooks/useGetUsernameFromParams/useGetUsernameFromParams';

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

  const username = useGetUsernameFromParams();

  function onReSendClick() {
    mutate(
      { email: username },
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
