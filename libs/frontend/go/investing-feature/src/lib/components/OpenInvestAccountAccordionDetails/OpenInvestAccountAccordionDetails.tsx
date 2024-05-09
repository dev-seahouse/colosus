import { AccordionDetails, styled } from '@bambu/react-ui';

/**
 *  TODO: create a mui variant with variant="dense"
 *  Just accordion details specifically for OpenInvestAccount form
 *  the only variation is having less horizontal padding
 *  it is not made a global override since we still want
 *  the default padding in other use cases other than
 *  within forms
 */
export const OpenInvestAccountAccordionDetails = styled(AccordionDetails)({
  padding: '32px 18px',
});

export default OpenInvestAccountAccordionDetails;
