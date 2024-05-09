import { GoAppLayout } from '@bambu/go-core';
import { Container, Stack, Typography } from '@bambu/react-ui';
import DirectDebitMandateSetupForm from '../../components/DirectDebitMandateSetupForm/DirectDebitMandateSetupForm';
import DirectDebitMandateSetupInfo from '../../components/DirectDebitMandateSetupInfo/DirectDebitMandateSetupInfo';

export function DirectDebitMandateSetupPage() {
  return (
    <GoAppLayout>
      <Container sx={{ pb: 4 }}>
        <Stack spacing={2} pb={2}>
          <Typography component={'h1'} fontSize={'22px'} fontWeight={'bold'}>
            Direct debit mandate setup
          </Typography>
          <DirectDebitMandateSetupInfo />
        </Stack>
        <DirectDebitMandateSetupForm />
      </Container>
    </GoAppLayout>
  );
}

export default DirectDebitMandateSetupPage;
