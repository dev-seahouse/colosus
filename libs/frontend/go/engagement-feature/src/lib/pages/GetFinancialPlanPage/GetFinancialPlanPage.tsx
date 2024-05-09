import { Header } from '@bambu/go-core';
import { Container } from '@bambu/react-ui';
import GetFinancialPlanForm from '../../components/GetFinancialPlanForm/GetFinancialPlanForm';

export function GetFinancialPlanPage() {
  return (
    <>
      <Header />
      <Container>
        <GetFinancialPlanForm />
      </Container>
    </>
  );
}

export default GetFinancialPlanPage;
