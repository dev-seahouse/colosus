import { lighten } from '@mui/material/styles';
import type { ProjectionGraphProps } from './ProjectionGraph';
import type { Theme } from '@mui/material/styles';
import { DateTime } from 'luxon';

export const getGraphValues = (data: ProjectionGraphProps['data']) =>
  data.length > 0
    ? data.map((d) => ({
        date: d.date,
        lowerBound: d.projectionLowerAmt,
        targetAmount: d.projectionTargetAmt,
        upperBound: d.projectionUpperAmt - d.projectionLowerAmt,
      }))
    : [];

export const getGraphColors = (theme: Theme) => ({
  upperBound: {
    fill: lighten(theme.palette.primary.main, 0.6),
  },
  projectedAmount: {
    stroke: theme.palette.primary.main,
  },
  cartesianGrid: {
    fill: theme.palette.divider,
  },
});

export const displayDateInYear = (date: string, index: number) => {
  const year = DateTime.fromISO(date).toFormat('yyyy');

  if (index === 0) {
    return `Today (${year})`;
  }

  return DateTime.fromISO(date).toFormat('yyyy');
};

export const displayShortenedInvestmentAmount = (amount: number | string) =>
  Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(amount));

export const getInterval = (data: ProjectionGraphProps['data']) => {
  const length = data.length;

  if (length <= 60) {
    return 11;
  }

  return (length - 1) / 6 - 1;
};
