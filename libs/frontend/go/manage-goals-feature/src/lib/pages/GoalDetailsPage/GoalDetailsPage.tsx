import { BackButton, Container, Stack } from '@bambu/react-ui';
import GoalDetailsTabs from '../../components/GoalDetailsTabs/GoalDetailsTabs';
import { GoAppLayout } from '@bambu/go-core';
import GoalDetailsGoalCard from '../../components/GoalDetailsGoalCard/GoalDetailsGoalCard';
import ManageGoalIconMenu from '../../ManageGoalIconMenu/ManageGoalIconMenu';

export function GoalDetailsPage() {
  return (
    <GoAppLayout>
      <Container sx={{ px: [3] }}>
        <Stack
          pb={2}
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <BackButton />
          <ManageGoalIconMenu />
        </Stack>
        <Stack spacing={1}>
          <GoalDetailsGoalCard />
          <GoalDetailsTabs />
        </Stack>
      </Container>
    </GoAppLayout>
  );
}

export default GoalDetailsPage;
