import {
  Box,
  Card,
  CardContent,
  ErrorLoadingData,
  Stack,
  Typography,
} from '@bambu/react-ui';
import { useNavigate, useParams } from 'react-router-dom';
import BankAccountDetailsCallout from '../BankAccountDetailsCallout/BankAccountDetailsCallout';
import { ReactNode, useState } from 'react';
import ChangeDirectDebitConfirmationDialog from '../ChangeDirectDebitConfirmationDialog/ChangeDirectDebitConfirmationDialog';

interface TransferFromCardProps {
  title?: ReactNode;
}
/*
 * PaymentMethod card for payment settings
 */
export function PaymentTransferCard({
  title = 'Transfer from',
}: TransferFromCardProps) {
  const navigate = useNavigate();
  const { goalId } = useParams();
  const [
    isChangeDirectDebitConfirmationDialogOpen,
    setIsChangeDirectDebitConfirmationDialogOpen,
  ] = useState(false);

  if (!goalId) {
    console.error('Goal id is required');
    return (
      <Card>
        <CardContent>
          <ErrorLoadingData />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Box pb={1.7}>
          <Typography variant={'h2'} fontSize={'1rem'} fontWeight={'bold'}>
            {title}
          </Typography>
        </Box>
        <Box display={'flex'} flexDirection={'column'}>
          <Stack spacing={1.3}>
            <BankAccountDetailsCallout
              onChangeDirectDebitClick={() => {
                setIsChangeDirectDebitConfirmationDialogOpen(true);
              }}
            />
            <Typography
              fontWeight={400}
              fontSize={10}
              color={'#494949'}
              lineHeight={1.8}
            >
              <strong>Notes:</strong>The cut-off time for fund transfers is
              1:30pm. Transfers placed after the cut-off time will be processed
              on the next business day.
            </Typography>
          </Stack>
        </Box>
        <ChangeDirectDebitConfirmationDialog
          open={isChangeDirectDebitConfirmationDialogOpen}
          onClose={() => setIsChangeDirectDebitConfirmationDialogOpen(false)}
          onConfirm={() => navigate(`/direct-debit-mandate-setup`)}
        />
      </CardContent>
    </Card>
  );
}

export default PaymentTransferCard;
