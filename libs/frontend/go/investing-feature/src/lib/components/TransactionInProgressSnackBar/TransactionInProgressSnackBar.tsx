import { Stack, Typography } from '@bambu/react-ui';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
export function TransactionInProgressSnackBar(props: { goal: any }) {
  return (
    <Stack direction={'row'} alignItems={'center'} spacing={2}>
      <CheckCircleIcon color={'success'} />
      <Typography variant={'body2'}>
        Transaction for "{props.goal?.goalDescription}" is in progress
      </Typography>
    </Stack>
  );
}

export default TransactionInProgressSnackBar;
