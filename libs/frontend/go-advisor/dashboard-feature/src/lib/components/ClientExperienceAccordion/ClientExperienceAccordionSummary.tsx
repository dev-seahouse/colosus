import { AccordionSummary, Typography, Box } from '@bambu/react-ui';

import type { AccordionSummaryProps } from '@bambu/react-ui';
import type { ReactNode } from 'react';

export interface ClientExperienceAccordionSummaryProps
  extends AccordionSummaryProps {
  label: ReactNode;
  status?: ReactNode;
}

export const ClientExperienceAccordionSummary = ({
  StartIcon,
  label,
  status,
  ...rest
}: ClientExperienceAccordionSummaryProps) => (
  <AccordionSummary
    StartIcon={StartIcon}
    {...rest}
    sx={{
      '& > .MuiAccordionSummary-content': {
        flexGrow: 1,
        '& > .MuiBox-root': {
          flexGrow: 1,
        },
      },
    }}
  >
    <Typography sx={{ flexGrow: 1 }}>{label}</Typography>
    {status && (
      <Box mr={2} display="inline-flex">
        {status}
      </Box>
    )}
  </AccordionSummary>
);

export default ClientExperienceAccordionSummary;
