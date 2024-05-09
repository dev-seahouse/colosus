import { Stack, Typography, Box } from '@bambu/react-ui';
import {
  VideoPlayer,
  useSelectHasUserCompletedContentQuery,
} from '@bambu/go-advisor-core';
import ClientExperienceAccordionDetails from '../ClientExperienceAccordionDetails';
import TimeToCompleteText from '../TimeToCompleteText';
import ContentAccordionButton from './ContentAccordionButton';

export const ContentAccordionDetails = () => {
  const { data: hasUserCompletedContent } =
    useSelectHasUserCompletedContentQuery();

  return (
    <ClientExperienceAccordionDetails>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <Typography>
          Increase your client conversion with the power of words. Use our
          content customization features to communicate your key values and
          propositions through the messaging on your client platform.
        </Typography>
        <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
          <ContentAccordionButton />
          {!hasUserCompletedContent && (
            <TimeToCompleteText expectedTimeToComplete={10} />
          )}
        </Box>
      </Stack>
      <Box>
        <VideoPlayer type="Content" />
      </Box>
    </ClientExperienceAccordionDetails>
  );
};

export default ContentAccordionDetails;
