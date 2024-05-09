import {
  getActiveMandate,
  getGoalStatusLabel,
  getGoalStatusLabelColor,
  SkeletonLoading,
  useGetDirectDebitMandates,
  useGetInvestorGoalDetails,
  useSelectHasActiveDirectDebitSubscriptions,
  useSelectHasPendingDirectDebitSubscriptions,
} from '@bambu/go-core';
import { Chip, ErrorLoadingData, Stack, Typography } from '@bambu/react-ui';
import { useParams } from 'react-router-dom';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import { GoalStatusEnum } from '@bambu/shared';

export default GoalDetailsGoalCard;

export function GoalDetailsGoalCard() {
  const { goalId } = useParams();
  const {
    data: goal,
    isLoading: isGoalLoading,
    isError: isGoalError,
    isSuccess: isGoalSuccess,
  } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    { enabled: !!goalId }
  );

  const { data: mandates } = useGetDirectDebitMandates();

  const activeMandate = getActiveMandate(mandates);

  const hasActiveDirectDebitSubscription =
    useSelectHasActiveDirectDebitSubscriptions(
      {
        goalId: goalId,
        mandateId: activeMandate?.id ?? '',
      },
      {
        enabled: !!activeMandate?.id && !!goalId,
      }
    );

  const hasPendingDirectDebitSubscription =
    useSelectHasPendingDirectDebitSubscriptions(
      {
        goalId: goalId,
        mandateId: activeMandate?.id ?? '',
      },
      {
        enabled: !!activeMandate?.id && !!goalId,
      }
    );

  const goalStatusLabel = getGoalStatusLabel(
    goal?.status || GoalStatusEnum.PENDING
  );

  if (isGoalLoading) {
    return <SkeletonLoading variant={'small'} />;
  }

  if (isGoalError || !isGoalSuccess) {
    return <ErrorLoadingData />;
  }

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      <Stack
        direction="row"
        justifyContent={'center'}
        alignItems={'center'}
        spacing={1.8}
      >
        <GolfCourseIcon sx={{ fontSize: '40px' }} />
        <Typography fontWeight={'bold'} fontSize={'1rem'}>
          {goal?.goalDescription}
        </Typography>
      </Stack>
      <Typography>
        <Chip
          size="small"
          label={goalStatusLabel}
          sx={{
            fontSize: 14,
            color: 'white',
            width: '66px',
            pb: '2px',
            backgroundColor: getGoalStatusLabelColor(goalStatusLabel),
          }}
        />
      </Typography>
    </Stack>
  );
}
