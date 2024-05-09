import { Box, Chip, Stack, Typography } from '@bambu/react-ui';

import type { GoalStatusLabelValues } from '@bambu/go-core';
import { CurrencyText, getGoalStatusLabelColor } from '@bambu/go-core';
import GolfCourse from '@mui/icons-material/GolfCourse';

export function GoalCardHeader(props: {
  goalTitle: string;
  goalValue: number;
  goalEndYear: string | undefined;
  goalStatusLabel: GoalStatusLabelValues;
}) {
  return (
    <Box display={'flex'} alignItems={'center'}>
      <Box
        display={'inline-flex'}
        flexGrow={100}
        gap={2.3}
        alignItems={'center'}
      >
        <GolfCourse />
        <Stack direction={'column'}>
          <Typography fontSize={16}>{props.goalTitle}</Typography>
          <Typography fontSize={12}>
            <CurrencyText value={props.goalValue} decimalScale={2} /> by{' '}
            {props.goalEndYear}
          </Typography>
        </Stack>
      </Box>
      <Box flexGrow={1}>
        <Chip
          size={'small'}
          label={props.goalStatusLabel}
          sx={{
            color: 'white',
            backgroundColor: getGoalStatusLabelColor(props.goalStatusLabel),
          }}
        />
      </Box>
    </Box>
  );
}
