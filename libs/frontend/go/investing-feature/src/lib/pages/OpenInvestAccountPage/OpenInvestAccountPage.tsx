/* eslint-disable-next-line */
import { GoAppLayout } from '@bambu/go-core';
import { Container, Stack, Typography } from '@bambu/react-ui';
import OpenInvestAccountForm from '../../components/OpenInvestAccountForm/OpenInvestAccountForm';

export function OpenInvestAccountPage() {
  return (
    <GoAppLayout>
      <Container>
        <Stack spacing={1.4}>
          <Typography component={'h1'} fontSize={'22px'}>
            Investment account opening
          </Typography>
          <OpenInvestAccountForm />
        </Stack>
      </Container>
    </GoAppLayout>
  );
}

export default OpenInvestAccountPage;
