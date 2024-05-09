import type { Meta, StoryObj } from '@storybook/react';
import { TransactAssetAllocationTableRow } from './TransactAssetAllocationTableRow';
import { FormProvider, useForm } from 'react-hook-form';

const meta: Meta<typeof TransactAssetAllocationTableRow> = {
  component: TransactAssetAllocationTableRow,
  title: 'portfolios/components/TransactAssetAllocationTableRow',
};
export default meta;
type Story = StoryObj<typeof TransactAssetAllocationTableRow>;

const Test = () => {
  const methods = useForm({});

  const data = {
    instrumentId: 'c17f9b17d0d8177afae3453429e221aa',
    ticker: 'CASH_GBP',
    name: 'Cash - Pound Sterling',
    currency: 'GBP',
    type: 'Cash',
    weightage: 2,
    id: '6c78ab60-94ff-4c64-90dc-5718cfb04249',
  };

  return (
    <FormProvider {...methods}>
      <TransactAssetAllocationTableRow
        data={data}
        index={0}
        control={methods.control as any}
      />
    </FormProvider>
  );
};

export const Primary = {
  args: {},
  render: () => <Test />,
};
