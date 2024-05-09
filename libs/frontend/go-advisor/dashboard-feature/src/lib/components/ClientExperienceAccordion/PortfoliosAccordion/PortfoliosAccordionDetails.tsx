import { Stack, Typography, Box } from '@bambu/react-ui';
import {
  VideoPlayer,
  useSelectHasUserCompletedPortfoliosQuery,
} from '@bambu/go-advisor-core';
import ClientExperienceAccordionDetails from '../ClientExperienceAccordionDetails';
import TimeToCompleteText from '../TimeToCompleteText';
import PortfoliosAccordionButton from './PortfoliosAccordionButton';

export const PortfoliosAccordionDetails = () => {
  const { data: hasUserCompletedPortfolios } =
    useSelectHasUserCompletedPortfoliosQuery();

  return (
    <ClientExperienceAccordionDetails>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <Typography>
          Let your clients know that you’ve got the perfect product to help them
          realize their financial goals. Configure your portfolios and Bambu GO
          will ensure your clients see the products that match their investment
          needs.
        </Typography>
        <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
          <PortfoliosAccordionButton />
          {!hasUserCompletedPortfolios && (
            <TimeToCompleteText expectedTimeToComplete={10} />
          )}
        </Box>
      </Stack>
      <Box>
        <VideoPlayer type="Portfolio" />
      </Box>
    </ClientExperienceAccordionDetails>
  );
};

export default PortfoliosAccordionDetails;
