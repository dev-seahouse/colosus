import { AccordionDetails, Box } from '@bambu/react-ui';
import type { AccordionDetailsProps } from '@bambu/react-ui';

export type ClientExperienceAccordionDetailsProps = AccordionDetailsProps;

export const ClientExperienceAccordionDetails = ({
  children,
  ...rest
}: ClientExperienceAccordionDetailsProps) => (
  <AccordionDetails {...rest} sx={{ padding: '2rem' }}>
    <Box display="flex" alignItems="center" sx={{ gap: 4 }}>
      {children}
    </Box>
  </AccordionDetails>
);

export default ClientExperienceAccordionDetails;
