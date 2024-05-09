import type { Meta } from '@storybook/react';
import { Typography } from '@bambu/react-ui';
import { Step } from './Step';
import { StepLabel } from './StepLabel';
import { StepContent } from './StepContent';
import { StaticStepper } from './StaticStepper';

const Story: Meta<typeof StaticStepper> = {
  component: StaticStepper,
  title: 'conversion/components/StaticStepper',
};
export default Story;

const steps = [
  {
    label: 'Create account',
    description: `Creating an account allows you to save your progress and secure the informations.`,
  },
  {
    label: 'Schedule an appointment',
    description: `Schedule a no-obligation session with a trusted advisor for expert insights and enhance your investment strategy.`,
  },
];

export const Primary = {
  render: () => (
    <StaticStepper>
      {steps.map((step, index) => (
        <Step>
          <StepLabel index={index}>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {step.label}
            </Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" sx={{ fontWeight: 300 }}>
              {step.description}
            </Typography>
          </StepContent>
        </Step>
      ))}
    </StaticStepper>
  ),
};

export const Horizontal = {
  render: () => (
    <StaticStepper orientation="horizontal">
      {steps.map((step, index) => (
        <Step>
          <StepLabel index={index}>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {step.label}
            </Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" sx={{ fontWeight: 300 }}>
              {step.description}
            </Typography>
          </StepContent>
        </Step>
      ))}
    </StaticStepper>
  ),
};
