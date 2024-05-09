import type { Meta } from '@storybook/react';
import { PieChartLegend } from './PieChartLegend';

const Story: Meta<typeof PieChartLegend> = {
  component: PieChartLegend,
  title: 'Pie Chart Legend',
};

const sampleData = [
  {
    name: 'Equity',
    value: 5,
    color: '#CEE9DC',
  },
  {
    name: 'Money Market',
    value: 10,
    color: '#C3E8FE',
  },
  {
    name: 'Bonds',
    value: 70,
    color: '#80F8D2',
  },
  {
    name: 'Other',
    value: 5,
    color: '#344C43',
  },
  {
    name: 'Cash',
    value: 10,
    color: '#8E918F',
  },
];
export default Story;

export const Primary = {
  args: {
    data: sampleData,
    labels: ['Assets', 'Products'],
  },
};
