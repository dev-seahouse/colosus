import { Typography } from '@bambu/react-ui';
import type { TypographyProps } from '@bambu/react-ui';

export type SettingsFormTitleProps = Pick<TypographyProps, 'children'>;

export const SettingsFormTitle = ({ children }: SettingsFormTitleProps) => (
  <Typography fontWeight={700}>{children}</Typography>
);

export default SettingsFormTitle;
