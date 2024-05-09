import { Typography } from '@bambu/react-ui';
import { StaticStepper, Step, StepContent, StepLabel } from '../StaticStepper';
import type { ReactNode } from 'react';
import React from 'react';

interface InstructionStepsProps {
  steps: Array<{ label: ReactNode; description: ReactNode }>;
}
export function InstructionSteps({ steps }: InstructionStepsProps) {
  return (
    <StaticStepper>
      {React.Children.toArray(
        steps.map((step, index) => (
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
        ))
      )}
    </StaticStepper>
  );
}

export default InstructionSteps;
