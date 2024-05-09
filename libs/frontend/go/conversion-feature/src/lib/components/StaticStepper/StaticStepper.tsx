import { styled } from '@bambu/react-ui';

interface StaticStepper {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
}

const StepperRoot = styled('div')<{
  orientation: StaticStepper['orientation'];
}>(
  {
    display: 'inline-flex',
    alignItems: 'flex-start',
  },
  (props) => ({
    flexDirection: props.orientation === 'horizontal' ? 'row' : 'column',
  })
);

/**
 * For displaying static (non-interactive) steps
 * For interactive steps, use MUI's Stepper component
 */
export function StaticStepper({
  children,
  orientation = 'vertical',
}: StaticStepper) {
  return <StepperRoot orientation={orientation}>{children}</StepperRoot>;
}

export default StaticStepper;
