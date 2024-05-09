import {
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Line,
  ComposedChart,
  Tooltip,
} from 'recharts';
import { useMemo } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import {
  getGraphValues,
  getGraphColors,
  displayDateInYear,
  displayShortenedInvestmentAmount,
  getInterval,
} from './ProjectionGraph.utils';
import { renderReferenceLineLabel, CustomTooltip } from './renderCustomElement';

interface ProjectionData {
  date: string;
  goalAmountNet: number;
  projectionLowerAmt: number;
  projectionMiddleAmt: number;
  projectionTargetAmt: number;
  projectionUpperAmt: number;
}

export interface ProjectionGraphProps {
  data: ProjectionData[];
  goalTargetValue?: number;
  ReferenceLineProps?: {
    label?: string;
  };
  goalType: string | null;
}

const ChartWrapper = styled(ResponsiveContainer)(({ theme }) => ({
  '.recharts-text, .recharts-reference-line-title': {
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.75rem',
    color: theme.palette.grey[500],
    fontWeight: 300,
    [theme.breakpoints.down('md')]: {
      fontSize: '0.625rem',
    },
  },
  '.recharts-reference-line-subtitle': {
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.875rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '0.75rem',
    },
  },
}));

export function ProjectionGraph({
  data,
  goalTargetValue = 0,
  ReferenceLineProps,
  goalType,
}: ProjectionGraphProps) {
  const graphData = useMemo(() => getGraphValues(data), [data]);
  const theme = useTheme();
  const graphColors = useMemo(() => getGraphColors(theme), [theme]);

  return (
    <ChartWrapper width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={graphData}
        margin={{
          top: 10,
          right: 20,
          bottom: 0,
          left: -20,
        }}
      >
        <XAxis
          dataKey="date"
          interval={getInterval(data)}
          tickFormatter={displayDateInYear}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={displayShortenedInvestmentAmount}
        />
        <CartesianGrid
          vertical={false}
          stroke={graphColors.cartesianGrid.fill}
          strokeOpacity={0.4}
        />
        <ReferenceLine
          y={goalTargetValue}
          label={({ viewBox }) =>
            renderReferenceLineLabel({
              viewBox,
              goalTargetValue,
              ...(ReferenceLineProps?.label && {
                label: ReferenceLineProps.label,
              }),
            })
          }
          stroke={graphColors.cartesianGrid.fill}
          strokeDasharray="3 3"
        />
        <Area
          type="monotone"
          dataKey="lowerBound"
          stackId="1"
          stroke="#fff"
          fill="#fff"
          fillOpacity={0}
        />
        <Area
          type="monotone"
          dataKey="upperBound"
          stackId="1"
          stroke={graphColors.upperBound.fill}
          fill={graphColors.upperBound.fill}
          fillOpacity={0.8}
        />
        <Line
          type="monotone"
          dataKey="targetAmount"
          stroke={graphColors.projectedAmount.stroke}
          dot={false}
        />
        <Tooltip
          wrapperStyle={{ outline: 'none' }}
          content={<CustomTooltip goalType={goalType} />}
        />
      </ComposedChart>
    </ChartWrapper>
  );
}

export default ProjectionGraph;
