import { Stack, Typography, Box } from '@bambu/react-ui';

import ClientExperienceAccordionDetails from '../ClientExperienceAccordionDetails';
import TimeToCompleteText from '../TimeToCompleteText';
import UploadLegalDocsImg from './assets/legal-docs.svg';
import RegulatoryAccordionButton from './RegulatoryAccordionButton';
import { useSelectHasUserUploadedDocumentQuery } from '@bambu/go-advisor-core';

export const RegulatoryAccordionDetails = () => {
  const { data: userHasUploadedDocument } =
    useSelectHasUserUploadedDocumentQuery();

  return (
    <ClientExperienceAccordionDetails>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <Typography>
          For regulatory purposes we require you to provide a privacy policy and
          disclaimer that can be accessed by clients of your robo.
        </Typography>
        <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
          <RegulatoryAccordionButton />
          {!userHasUploadedDocument && (
            <TimeToCompleteText expectedTimeToComplete={5} />
          )}
        </Box>
      </Stack>
      <img
        src={UploadLegalDocsImg}
        alt="Upload legal documents"
        width={256}
        height={147}
      />
    </ClientExperienceAccordionDetails>
  );
};

export default RegulatoryAccordionDetails;
