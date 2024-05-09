import type { ReactNode } from 'react';
import { styled } from '@mui/material';

interface StepContentProps {
  children: ReactNode;
}

export const StepContentRoot = styled('div')({
  marginLeft: 14, // half icon
  paddingLeft: 8 + 14, // margin + half icon
  paddingRight: 8,
  paddingBottom: '1rem',
});

// @see Step.tsx
export const stepContentBorderStyles = {
  '.StepContent-root': {
    borderLeft: '1px solid #E5E7EB',
  },
  ':last-child .StepContent-root': {
    borderLeft: 'none',
  },
};

export function StepContent({ children }: StepContentProps) {
  return (
    <StepContentRoot className="StepContent-root">{children}</StepContentRoot>
  );
}
