import { Box, Stack, Tooltip, Typography } from '@bambu/react-ui';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export function DirectDebitConfirmationSuccessSackBar(props: {
  onClick: () => void;
}) {
  return (
    <Stack direction={'row'} alignItems={'center'} spacing={2}>
      <CheckCircleOutlineIcon color={'success'} />
      <Box>
        <Typography fontSize={'14px'} fontWeight={'bold'}>
          Your Direct Debit mandate has been set up
        </Typography>
        <Typography fontSize={'14px'}>
          Your Direct Debit mandate has been set up You will receive an email
          from GoCardless Ltd.{' '}
          <Tooltip
            icon={<ErrorOutlineIcon color={'success'} />}
            onClick={props.onClick}
          />{' '}
          within 3 working days conforming the Direct Debit mandate has been set
          up.
        </Typography>
      </Box>
    </Stack>
  );
}

export default DirectDebitConfirmationSuccessSackBar;
