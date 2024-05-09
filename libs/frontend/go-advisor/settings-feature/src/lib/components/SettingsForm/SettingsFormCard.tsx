import { Card, Box } from '@bambu/react-ui';
import type { CardProps, BoxProps } from '@bambu/react-ui';

export interface SettingsFormCardProps extends Omit<CardProps, 'children'> {
  children?: BoxProps['children'];
}

export const SettingsFormCard = ({
  children,
  ...rest
}: SettingsFormCardProps) => (
  <Card {...rest}>
    <Box p={3} pr={12}>
      {children}
    </Box>
  </Card>
);

export default SettingsFormCard;
