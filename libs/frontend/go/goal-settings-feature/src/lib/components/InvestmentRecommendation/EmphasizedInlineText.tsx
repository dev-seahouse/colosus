import { Typography } from '@bambu/react-ui';

import type { ReactNode } from 'react';

export interface EmphasizedInlineTextProps {
  children: ReactNode;
}
export const EmphasizedInlineText = ({
  children,
}: EmphasizedInlineTextProps) => (
  <Typography as="span" sx={{ fontWeight: 700 }}>
    {children}
  </Typography>
);

export default EmphasizedInlineText;
