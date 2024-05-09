import {
  BoxWithLightenedPrimaryColor,
  useSelectAdvisorProfilePicture,
  useSelectAdvisorReasonsToContactMeQuery,
  useSelectAdvisorSubscriptionTypeQuery,
} from '@bambu/go-core';
import { Box, Button, Stack, styled } from '@bambu/react-ui';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router-dom';
import HtmlContent from '../HtmlContent/HtmlContent';
import type { GetOptimizedProjectionData } from '../../hooks/useGetOptimizedProjection/useGetOptimizedProjection';
import { useSelectUpdateProjectedRecommendation } from '../../store/useGoalSettingsStore.selectors';

const ProfileImg = styled('img')<{ isShown: boolean }>(
  {
    display: 'block',
    height: '81px',
    aspectRatio: '1 / 1.1',
  },
  ({ isShown }) => ({
    display: isShown ? 'block' : 'none',
  })
);

export interface ContactAdvisorProps {
  initialData?: GetOptimizedProjectionData;
}

export function ContactAdvisor({ initialData }: ContactAdvisorProps) {
  const { data: content = '' } = useSelectAdvisorReasonsToContactMeQuery();
  const { data: profilePicture } = useSelectAdvisorProfilePicture();
  const { data: subscriptionType } = useSelectAdvisorSubscriptionTypeQuery();
  const navigate = useNavigate();
  const updateProjectedRecommendation = useSelectUpdateProjectedRecommendation({
    ...(initialData && { initialData }),
  });

  const handleScheduleAppointment = () => {
    updateProjectedRecommendation();
    navigate('/schedule-appointment');
  };

  return (
    <BoxWithLightenedPrimaryColor px={3} py={4}>
      <Stack spacing={1}>
        <Box sx={{ wordWrap: 'break-word', display: 'flex', gap: '12px' }}>
          <HtmlContent content={content} />
          <ProfileImg
            loading="lazy"
            decoding="async"
            src={profilePicture}
            alt="photo of the advidor"
            isShown={!!profilePicture}
          />
        </Box>
        {subscriptionType !== 'TRANSACT' ? (
          <Box>
            <Button
              startIcon={<CalendarTodayIcon />}
              onClick={handleScheduleAppointment}
              fullWidth
            >
              Contact Me
            </Button>
          </Box>
        ) : null}
      </Stack>
    </BoxWithLightenedPrimaryColor>
  );
}

export default ContactAdvisor;
