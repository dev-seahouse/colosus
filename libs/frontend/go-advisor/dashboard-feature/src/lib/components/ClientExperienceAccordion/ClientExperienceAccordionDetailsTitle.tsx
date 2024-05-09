import { Typography } from '@bambu/react-ui';
import type { TypographyProps } from '@bambu/react-ui';

export type ClientExperienceAccordionDetailsTitleProps = Omit<
  TypographyProps,
  'fontWeight'
>;

export const ClientExperienceAccordionDetailsTitle = (
  props: ClientExperienceAccordionDetailsTitleProps
) => <Typography {...props} fontWeight={700} />;

export default ClientExperienceAccordionDetailsTitle;
