import { Stack, Typography, Box } from '@bambu/react-ui';
import {
  VideoPlayer,
  useSelectHasUserCompletedGoalsQuery,
} from '@bambu/go-advisor-core';
import ClientExperienceAccordionDetails from '../ClientExperienceAccordionDetails';
import TimeToCompleteText from '../TimeToCompleteText';
import GoalsAccordionButton from './GoalsAccordionButton';

export const GoalsAccordionDetails = () => {
  const { data: hasUserCompletedGoals } = useSelectHasUserCompletedGoalsQuery();

  return (
    <ClientExperienceAccordionDetails>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <Typography>
          Building meaningful connections with every client means understanding
          their most-valued financial goals. Put client needs at the heart of
          your personalized advice strategy by using our goal management
          features.
        </Typography>
        <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
          <GoalsAccordionButton />
          {!hasUserCompletedGoals && (
            <TimeToCompleteText expectedTimeToComplete={2} />
          )}
        </Box>
      </Stack>
      <Box>
        <VideoPlayer type="Goals" />
      </Box>
    </ClientExperienceAccordionDetails>
  );
};

export default GoalsAccordionDetails;
