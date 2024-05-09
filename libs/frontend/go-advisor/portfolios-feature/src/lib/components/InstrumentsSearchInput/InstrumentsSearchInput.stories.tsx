import type { Meta, StoryObj } from '@storybook/react';
import { InstrumentsSearchInput } from './InstrumentsSearchInput';
import { FormProvider, useForm } from 'react-hook-form';

const meta: Meta<typeof InstrumentsSearchInput> = {
  component: InstrumentsSearchInput,
  title: 'portfolios/components/InstrumentsSearchInput',
};
export default meta;
type Story = StoryObj<typeof InstrumentsSearchInput>;

function Test() {
  const methods = useForm({
    defaultValues: {
      hello: '',
    },
  });
  return (
    <FormProvider {...methods}>
      <InstrumentsSearchInput control={methods.control} name={'hello'} />
    </FormProvider>
  );
}

export const Primary = {
  args: {},
  render: () => <Test />,
};
