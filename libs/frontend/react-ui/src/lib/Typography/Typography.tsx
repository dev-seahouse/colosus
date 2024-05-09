import MuiTypography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import type { CSSProperties } from 'react';

import type { TypographyProps as MuiTypographyProps } from '@mui/material/Typography';

export interface TypographyProps extends MuiTypographyProps {
  /**
   * Align text on mobile
   */
  mobiletextalign?: CSSProperties['textAlign'];
}

export const Typography = styled(MuiTypography)<TypographyProps>(
  ({ theme, mobiletextalign }) => ({
    ...(mobiletextalign && {
      [theme.breakpoints.down('md')]: {
        textAlign: mobiletextalign,
      },
    }),
  })
);

export default Typography;
