import { Tooltip, Typography } from '@bambu/react-ui';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WealthKernelContactInfoDialog from '../WealthKernelContactInfoDialog/WealthKernelContactInfoDialog';
import { useReducer } from 'react';

export function DirectDebitMandateSetupInfo() {
  const [
    isWealthKernelContactInfoDialogOpen,
    toggleWealthContactInfoDialogOpen,
  ] = useReducer((state) => !state, false);
  return (
    <>
      <Typography>
        By setting up a Direct Debit mandate, you are giving <b>Wealthkernel</b>
        <Tooltip
          icon={
            <ErrorOutlineOutlinedIcon color={'primary'} fontSize={'small'} />
          }
          onClick={toggleWealthContactInfoDialogOpen}
        />
        money from your bank account to ours. Once you have set up the mandate
        you will be able to set up payments via Direct Debit.
      </Typography>
      <WealthKernelContactInfoDialog
        onClose={toggleWealthContactInfoDialogOpen}
        open={isWealthKernelContactInfoDialogOpen}
      />
    </>
  );
}

export default DirectDebitMandateSetupInfo;
