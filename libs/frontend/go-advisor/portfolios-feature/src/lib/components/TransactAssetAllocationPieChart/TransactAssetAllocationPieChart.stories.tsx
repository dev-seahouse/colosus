import type { Meta, StoryObj } from '@storybook/react';
import { TransactAssetAllocationPieChart } from './TransactAssetAllocationPieChart';
import { FormProvider, useForm } from 'react-hook-form';

const meta: Meta<typeof TransactAssetAllocationPieChart> = {
  component: TransactAssetAllocationPieChart,
  title: 'portfolios/components/TransactAssetAllocationPieChart',
};
export default meta;
type Story = StoryObj<typeof TransactAssetAllocationPieChart>;

const Test = () => {
  const methods = useForm({
    defaultValues: {
      transact: {
        instruments: [
          {
            instrumentId: 'c17f9b17d0d8177afae3453429e221aa',
            ticker: 'CASH_GBP',
            name: 'Cash - Pound Sterling',
            currency: 'GBP',
            type: 'Cash',
            weightage: 99,
          },
        ],
      },
    },
  });
  return (
    <FormProvider {...methods}>
      <TransactAssetAllocationPieChart />
    </FormProvider>
  );
};

export const Primary = {
  args: {},
  render: () => <Test />,
};
