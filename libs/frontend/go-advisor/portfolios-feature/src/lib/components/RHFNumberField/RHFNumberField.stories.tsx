import type { Meta, StoryObj } from '@storybook/react';
import { RHFNumberField } from './RHFNumberField';
import { FormProvider, useForm } from 'react-hook-form';

const meta: Meta<typeof RHFNumberField> = {
  component: RHFNumberField,
  title: 'portfolios/components/RHFNumberField',
};
export default meta;
type Story = StoryObj<typeof RHFNumberField>;

function Test() {
  const methods = useForm({
    defaultValues: {
      hello: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <RHFNumberField
        name={'hello'}
        control={methods.control}
        size={'small'}
        variant={'filled'}
      />
    </FormProvider>
  );
}

export const Primary = {
  args: {},
  render: () => <Test />,
};
