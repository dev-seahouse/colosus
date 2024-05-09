import {
  useSelectAdvisorBioQuery,
  useSelectAdvisorFirstNameQuery,
} from '@bambu/go-core';
import { Box, Stack, Typography, MuiLink } from '@bambu/react-ui';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import HtmlContent from '../HtmlContent/HtmlContent';

export function AdvisorProfile() {
  const { data } = useSelectAdvisorBioQuery();
  const { data: firstName = '[First Name]' } = useSelectAdvisorFirstNameQuery();

  if (!data || data.content === '') {
    return null;
  }
  return (
    <Box px={3} py={4} sx={{ wordWrap: 'break-word' }}>
      <Stack spacing={1}>
        <Typography fontWeight={600}>{`${firstName}'s Profile`}</Typography>
        <HtmlContent content={data.content} />
        {data.fullProfileLink ? (
          <MuiLink
            underline="always"
            href={data.fullProfileLink}
            target="_blank"
            rel="noopener"
          >
            <Box sx={{ display: 'flex' }}>
              View profile
              <ArrowForwardIcon />
            </Box>
          </MuiLink>
        ) : null}
      </Stack>
    </Box>
  );
}

export default AdvisorProfile;
