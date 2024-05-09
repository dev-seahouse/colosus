import { styled } from '@mui/material';
import StepIcon from './StepIcon';
import type { ReactNode } from 'react';

interface StepLabelProps {
  children: ReactNode;
  // index of the label 1, 2, 3 e.g
  index: number;
}

const StepLabelRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'left',
  padding: '4px 0',
}));
export function StepLabel({ children, index }: StepLabelProps) {
  return (
    <StepLabelRoot>
      <StepIcon>{index + 1}</StepIcon>
      {children}
    </StepLabelRoot>
  );
}

export default StepLabel;
