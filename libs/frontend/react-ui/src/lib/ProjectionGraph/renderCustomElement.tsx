import { DateTime } from 'luxon';
import { NumericFormat } from 'react-number-format';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useLocalizedCurrencySymbol
  from '../hooks/useLocalizedCurrencySymbol/useLocalizedCurrencySymbol';

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ReferenceLineLabelProps {
  viewBox: ViewBox;
  goalTargetValue: number;
  label?: string;
}

interface CurrencyTextProps {
  value: number;
}
const CurrencyText = ({ value }: CurrencyTextProps) => {
  const currencySymbol = useLocalizedCurrencySymbol();

  return (
    <NumericFormat
      value={value}
      displayType="text"
      prefix={currencySymbol}
      thousandSeparator
      decimalScale={0}
    />
  );
};

export const renderReferenceLineLabel = ({
  viewBox,
  goalTargetValue,
  label = 'Target goal amount',
}: ReferenceLineLabelProps) => {
  return (
    <g>
      <foreignObject
        x={viewBox.x}
        y={viewBox.y - 37.5}
        width="100%"
        height={50}
      >
        <Stack>
          <span className="recharts-reference-line-title">{label}</span>
          <span className="recharts-reference-line-subtitle">
            <CurrencyText value={goalTargetValue} />
          </span>
        </Stack>
      </foreignObject>
    </g>
  );
};

interface Payload {
  lowerBound: number;
  targetAmount: number;
  upperBound: number;
  date: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: Payload }[];
  goalType: string | null;
}

export const CustomTooltip = ({
  active,
  payload,
  goalType,
}: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const current = payload[0].payload;
  const date = DateTime.fromISO(current.date).toFormat('MMM yyyy');
  const upperBound = current.lowerBound + current.upperBound;

  return (
    <Paper sx={{ maxWidth: 294, p: 2 }}>
      <Typography variant="caption" color="grey.700">
        {date}
      </Typography>
      <Typography variant="subtitle2">
        Your investment{' '}
        {goalType === 'Growing Wealth' ? 'has potential' : 'is expected'} to
        grow to{' '}
        <strong>
          <CurrencyText value={current.targetAmount} />
        </strong>{' '}
        but it may fluctuate between{' '}
        <strong>
          <CurrencyText value={current.lowerBound} />
        </strong>{' '}
        to{' '}
        <strong>
          <CurrencyText value={upperBound} />
        </strong>
      </Typography>
    </Paper>
  );
};
