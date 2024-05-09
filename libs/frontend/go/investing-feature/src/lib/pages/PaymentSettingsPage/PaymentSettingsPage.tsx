import { GoAppLayout } from '@bambu/go-core';
import { Box, Container, Typography } from '@bambu/react-ui';
import PaymentSettingsForm from '../../components/PaymentSettingsForm/PaymentSettingsForm';

export function PaymentSettingsPage() {
  return (
    <GoAppLayout>
      <Container sx={{ pb: 4 }}>
        <Box pb={2}>
          <Typography component={'h1'} fontSize={'22px'}>
            Payment settings
          </Typography>
        </Box>
        <PaymentSettingsForm />
      </Container>
    </GoAppLayout>
  );
}

export default PaymentSettingsPage;
