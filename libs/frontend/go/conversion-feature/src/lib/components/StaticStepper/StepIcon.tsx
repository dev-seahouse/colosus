import { styled } from '@mui/material';
import type { ReactNode } from 'react';

import { SvgIcon, Box } from '@bambu/react-ui';

const ICON_SIZE = 28;
const RADIUS = ICON_SIZE / 2;

const StepIconRoot = styled(SvgIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.primary.main,
  fontSize: `${ICON_SIZE}px`, // 28px
}));

const StepIconText = styled('text')(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  fill: theme.palette.primary.contrastText,
}));

export function StepIcon({ children }: { children: ReactNode }) {
  return (
    <Box display="flex">
      <StepIconRoot viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`}>
        <circle cx={RADIUS} cy={RADIUS} r={RADIUS} />
        <StepIconText
          x={RADIUS}
          y={RADIUS - 1} // adjustment to center text
          textAnchor="middle"
          dominantBaseline="central"
        >
          {children}
        </StepIconText>
      </StepIconRoot>
    </Box>
  );
}

export default StepIcon;
