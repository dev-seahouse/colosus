import { Box, Stack, Typography } from '@bambu/react-ui';
import type { RetirementGoalAmountProps } from './RetirementMonthlyExpensesForm';
import { CurrencyText } from '@bambu/go-core';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
export default function RetirementMonthlyExpenseBanner({
  goalValue,
}: RetirementGoalAmountProps) {
  return (
    <Box sx={{ padding: '1rem', background: '#f3fff8' }}>
      <Stack direction="row" spacing={2}>
        <Stack>
          <LightbulbIcon
            sx={(theme) => ({
              color: '#00876a',
            })}
          />
        </Stack>
        <Stack direction="row">
          <Typography variant="body2">
            To maintain your lifestyle, you’ll need a retirement lump-sum of{' '}
            <b>
              <CurrencyText value={goalValue} />
            </b>
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
