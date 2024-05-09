import type { Meta, StoryObj } from '@storybook/react';
import { RHFRadioGroupControl } from './RHFRadioGroupControl';
import { useForm } from 'react-hook-form';
import { Typography } from '@mui/material';

const meta: Meta<typeof RHFRadioGroupControl> = {
  component: TestComponent,
  title: 'investing/components/RHFRadioGroupControl',
};
export default meta;
type Story = StoryObj<typeof RHFRadioGroupControl>;

const radios = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

function TestComponent() {
  const methods = useForm();
  return (
    <RHFRadioGroupControl
      label={
        <Typography color="black" variant={'body2'} fontWeight="bold">
          Are you a U.S Citizen or Resident currently residing in the U.S.?
        </Typography>
      }
      control={methods.control}
      name="test"
      radios={radios}
    />
  );
}
export const Primary = {};
