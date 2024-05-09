import type { Meta, StoryObj } from '@storybook/react';
import { ProjectionGraph } from './ProjectionGraph';

const Story: Meta<typeof ProjectionGraph> = {
  component: ProjectionGraph,
  title: 'ProjectionGraph',
};
export default Story;

export const Primary: StoryObj<typeof ProjectionGraph> = {
  args: {
    data: [
      {
        date: '2023-05-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 0,
        projectionMiddleAmt: 0,
        projectionTargetAmt: 0,
        projectionUpperAmt: 0,
      },
      {
        date: '2023-06-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 82.2,
        projectionMiddleAmt: 83.27,
        projectionTargetAmt: 83.12,
        projectionUpperAmt: 84.35,
      },
      {
        date: '2023-07-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 164.23,
        projectionMiddleAmt: 166.8,
        projectionTargetAmt: 166.45,
        projectionUpperAmt: 169.43,
      },
      {
        date: '2023-08-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 246.18,
        projectionMiddleAmt: 250.61,
        projectionTargetAmt: 249.99,
        projectionUpperAmt: 255.13,
      },
      {
        date: '2023-09-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 328.12,
        projectionMiddleAmt: 334.68,
        projectionTargetAmt: 333.77,
        projectionUpperAmt: 341.42,
      },
      {
        date: '2023-10-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 410.07,
        projectionMiddleAmt: 419.03,
        projectionTargetAmt: 417.78,
        projectionUpperAmt: 428.25,
      },
      {
        date: '2023-11-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 492.06,
        projectionMiddleAmt: 503.65,
        projectionTargetAmt: 502.03,
        projectionUpperAmt: 515.61,
      },
      {
        date: '2023-12-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 574.11,
        projectionMiddleAmt: 588.54,
        projectionTargetAmt: 586.52,
        projectionUpperAmt: 603.48,
      },
      {
        date: '2024-01-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 656.22,
        projectionMiddleAmt: 673.7,
        projectionTargetAmt: 671.26,
        projectionUpperAmt: 691.84,
      },
      {
        date: '2024-02-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 738.2,
        projectionMiddleAmt: 760.31,
        projectionTargetAmt: 757.21,
        projectionUpperAmt: 783.32,
      },
      {
        date: '2024-03-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 820.32,
        projectionMiddleAmt: 847.32,
        projectionTargetAmt: 843.54,
        projectionUpperAmt: 875.53,
      },
      {
        date: '2024-04-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 902.6,
        projectionMiddleAmt: 934.75,
        projectionTargetAmt: 930.24,
        projectionUpperAmt: 968.45,
      },
      {
        date: '2024-05-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 985.05,
        projectionMiddleAmt: 1022.6,
        projectionTargetAmt: 1017.32,
        projectionUpperAmt: 1062.09,
      },
      {
        date: '2024-06-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1067.67,
        projectionMiddleAmt: 1110.87,
        projectionTargetAmt: 1104.78,
        projectionUpperAmt: 1156.43,
      },
      {
        date: '2024-07-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1150.48,
        projectionMiddleAmt: 1199.55,
        projectionTargetAmt: 1192.63,
        projectionUpperAmt: 1251.48,
      },
      {
        date: '2024-08-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1233.47,
        projectionMiddleAmt: 1288.66,
        projectionTargetAmt: 1280.87,
        projectionUpperAmt: 1347.22,
      },
      {
        date: '2024-09-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1316.67,
        projectionMiddleAmt: 1378.19,
        projectionTargetAmt: 1369.5,
        projectionUpperAmt: 1443.66,
      },
      {
        date: '2024-10-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1400.07,
        projectionMiddleAmt: 1468.15,
        projectionTargetAmt: 1458.52,
        projectionUpperAmt: 1540.79,
      },
      {
        date: '2024-11-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1483.69,
        projectionMiddleAmt: 1558.54,
        projectionTargetAmt: 1547.94,
        projectionUpperAmt: 1638.62,
      },
      {
        date: '2024-12-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1567.52,
        projectionMiddleAmt: 1649.36,
        projectionTargetAmt: 1637.75,
        projectionUpperAmt: 1737.14,
      },
      {
        date: '2025-01-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1651.56,
        projectionMiddleAmt: 1740.61,
        projectionTargetAmt: 1727.97,
        projectionUpperAmt: 1836.35,
      },
      {
        date: '2025-02-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1737.68,
        projectionMiddleAmt: 1836.43,
        projectionTargetAmt: 1822.4,
        projectionUpperAmt: 1942.94,
      },
      {
        date: '2025-03-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1824.17,
        projectionMiddleAmt: 1932.93,
        projectionTargetAmt: 1917.45,
        projectionUpperAmt: 2050.6,
      },
      {
        date: '2025-04-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1911.05,
        projectionMiddleAmt: 2030.1,
        projectionTargetAmt: 2013.13,
        projectionUpperAmt: 2159.32,
      },
      {
        date: '2025-05-03',
        goalAmountNet: 125492.5,
        projectionLowerAmt: 1998.3,
        projectionMiddleAmt: 2127.95,
        projectionTargetAmt: 2109.45,
        projectionUpperAmt: 2269.11,
      },
    ],
    goalTargetValue: 2000,
  },
  decorators: [(Story) => <div style={{ height: 400 }}>{Story()}</div>],
};
