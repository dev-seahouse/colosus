import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box, Typography } from '@bambu/react-ui';

export interface TimeToCompleteTextProps {
  expectedTimeToComplete?: number | string;
}

export const TimeToCompleteText = ({
  expectedTimeToComplete,
}: TimeToCompleteTextProps) => (
  <Box display="flex" alignItems="center">
    <HourglassEmptyIcon fontSize="small" />
    <Typography variant="caption">
      {`Expected time: ~${expectedTimeToComplete} minutes`}
    </Typography>
  </Box>
);

export default TimeToCompleteText;
