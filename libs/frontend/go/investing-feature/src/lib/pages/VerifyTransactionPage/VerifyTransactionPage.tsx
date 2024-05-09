import { GoAppLayout } from '@bambu/go-core';
import VerifyTransactionForm from '../../components/VerifyTransactionForm/VerifyTransactionForm';
import { BackButton, Container } from '@bambu/react-ui';

export function VerifyTransactionPage() {
  return (
    <GoAppLayout>
      <Container>
        <BackButton />
        <VerifyTransactionForm />
      </Container>
    </GoAppLayout>
  );
}

export default VerifyTransactionPage;
