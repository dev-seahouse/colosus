import { Stack, Typography, Box } from '@bambu/react-ui';
import {
  VideoPlayer,
  useSelectHasUserCompletedBrandingQuery,
} from '@bambu/go-advisor-core';
import ClientExperienceAccordionDetails from '../ClientExperienceAccordionDetails';
import TimeToCompleteText from '../TimeToCompleteText';
import BrandingAccordionButton from './BrandingAccordionButton';

export const BrandingAccordionDetails = () => {
  const hasUserCompletedBranding = useSelectHasUserCompletedBrandingQuery();

  return (
    <ClientExperienceAccordionDetails>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <Typography>
          You don’t need design experience to unleash the full potential of your
          brand. Quickly create a client platform that is uniquely yours by
          using our simple branding controls.
        </Typography>
        <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
          <BrandingAccordionButton />
          {!hasUserCompletedBranding && (
            <TimeToCompleteText expectedTimeToComplete={3} />
          )}
        </Box>
      </Stack>
      <Box>
        <VideoPlayer type="Branding" />
      </Box>
    </ClientExperienceAccordionDetails>
  );
};

export default BrandingAccordionDetails;
