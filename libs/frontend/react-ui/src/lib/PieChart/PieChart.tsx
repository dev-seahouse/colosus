import { Box, Paper, Typography } from '@mui/material';
import type { TooltipProps } from 'recharts';
import {
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  data: PieChartData[];
  /*
    1.maxHeight determins how large the pie chart will grow propotionally to container width
    2.chart will shrink if container size is below maxHeight
    3.height *cannot* be percentage, must be explicit
   */
  maxHeight?: number;
}

export function PieChart({ data, maxHeight = 250 }: PieChartProps) {
  return (
    <Box width={'100%'} height={maxHeight}>
      <ResponsiveContainer>
        <RePieChart>
          <Pie
            data={data}
            // outter radius - inner radius = thickness of pie ring
            innerRadius={'74.5%'}
            outerRadius={'90%'}
            fill="#8884d8"
            paddingAngle={1}
            dataKey="value"
            animationDuration={800}
          >
            {data.map((entry, index) => {
              return (
                <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
              );
            })}
          </Pie>
          <Tooltip content={CustomTooltip} wrapperStyle={{ outline: 'none' }} />
        </RePieChart>
      </ResponsiveContainer>
    </Box>
  );
}
function CustomTooltip({
  active,
  payload,
}: TooltipProps<ValueType, string | number>) {
  if (!active || payload?.length === 0) return null;
  return (
    <Paper sx={{ maxWidth: 200, p: 1 }}>
      <Typography variant="caption" color="grey.700">
        {payload?.[0].name}: {payload?.[0].value}%
      </Typography>
    </Paper>
  );
}

export default PieChart;
