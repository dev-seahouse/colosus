import { GoAppLayout, useGetInvestorGoalDetails } from '@bambu/go-core';
import { Container, Skeleton, Stack, Typography } from '@bambu/react-ui';
import { useParams } from 'react-router-dom';
import DepositForm from '../../components/DepositForm/DepositForm';

// TODO: extract this duplicate with Withdrawal page
export function DepositPage() {
  const { goalId } = useParams();

  const { data: goal, isLoading: isLoadingGoal } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    { enabled: !!goalId }
  );

  return (
    <GoAppLayout>
      <Container>
        <Stack spacing={1.6}>
          {isLoadingGoal ? (
            <Skeleton variant="text" sx={{ fontSize: '22px' }} />
          ) : (
            <Typography component={'h1'} fontSize={'22px'}>
              Deposit to "{goal?.goalDescription}" goal
            </Typography>
          )}
          <DepositForm />
        </Stack>
      </Container>
    </GoAppLayout>
  );
}

export default DepositPage;
