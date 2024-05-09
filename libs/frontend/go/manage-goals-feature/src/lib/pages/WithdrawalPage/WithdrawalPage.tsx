import { GoAppLayout, useGetInvestorGoalDetails } from '@bambu/go-core';
import { Container, Skeleton, Stack, Typography } from '@bambu/react-ui';
import { useParams } from 'react-router-dom';
import WithdrawalForm from '../../components/WithdrawalForm/WithdrawalForm';

// TODO: extract this, duplicate with Deposit page
export function WithdrawalPage() {
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
              Withdraw from "{goal?.goalDescription}" goal
            </Typography>
          )}
          <WithdrawalForm />
        </Stack>
      </Container>
    </GoAppLayout>
  );
}

export default WithdrawalPage;
