import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material';

import type { PieChartData } from '../PieChart/PieChart';

export interface PieChartLegend {
  label: string;
  value: number;
  color: string;
}

export interface PieChartLegendProps {
  labels: string[];
  data: PieChartData[];
  variant?: string;
}

const Square = styled('div')<{ color: string }>(
  {
    width: '24px',
    height: '24px',
    pointerEvents: 'none',
    borderRadius: '50%',
  },
  ({ color }) => ({ background: color })
);

const Circle = styled('div')<{ color: string }>(
  {
    width: '12px',
    height: '12px',
    pointerEvents: 'none',
    borderRadius: '50%',
  },
  ({ color }) => ({ background: color })
);

export function PieChartLegend({
  data,
  labels,
  variant = 'square',
}: PieChartLegendProps) {
  return (
    <Table aria-label="legend">
      {variant === 'square' ? (
        <>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {labels.map((entry, index) => (
                <TableCell key={`legend-label-${entry}_${index}`}>
                  <Typography variant="caption" fontWeight={600}>
                    {entry}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry, index) => (
              <TableRow key={entry.name}>
                <TableCell width={'24px'}>
                  <Square color={entry.color} />
                </TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell width="20px">{entry.value}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      ) : (
        <TableBody>
          {data.map((entry, index) => (
            <TableRow sx={{ '& td': { border: 0, p: 1 } }} key={entry.name}>
              <TableCell>
                <Circle color={entry.color} />
              </TableCell>
              <TableCell>{entry.name}</TableCell>
              <TableCell>({entry.value}%)</TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
}

export default PieChartLegend;
