import { Typography, Box } from '@bambu/react-ui';

import type { ReactNode } from 'react';

export interface DomainRuleProps {
  children: ReactNode;
}

export const DomainRule = ({ children }: DomainRuleProps) => {
  return (
    <Box display="flex" alignItems="center">
      <Box mr={1}>&#x2022;</Box>
      <Typography variant="body2" children={children} />
    </Box>
  );
};

export default DomainRule;
