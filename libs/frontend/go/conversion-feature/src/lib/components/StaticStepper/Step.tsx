import { styled } from '@mui/material';
import { stepContentBorderStyles } from './StepContent';
interface StepProps {
  children: React.ReactNode;
}

const StepRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  ...stepContentBorderStyles,
});

export function Step({ children }: StepProps) {
  return <StepRoot>{children}</StepRoot>;
}

export default Step;
