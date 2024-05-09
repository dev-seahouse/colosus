import { Tooltip, Typography } from '@bambu/react-ui';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
export function DirectDebitConfirmDisclaimer(props: { onClick: any }) {
  return (
    <>
      <Typography fontSize={'11px'}>
        By accepting this mandate, you are signing up to the terms set out in
        the mandate document above.
      </Typography>
      <Typography fontSize={'11px'}>
        You may cancel this Direct Debit mandate at any time by contacting
        WealthKernel{' '}
        <Tooltip
          icon={<ErrorOutlineIcon color={'primary'} />}
          onClick={props.onClick}
        />{' '}
        or your bank.
      </Typography>
    </>
  );
}
export default DirectDebitConfirmDisclaimer;
