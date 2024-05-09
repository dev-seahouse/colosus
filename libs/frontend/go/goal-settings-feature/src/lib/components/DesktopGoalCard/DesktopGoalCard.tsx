import {
  Card,
  Typography,
  Stack,
  Box,
  CardActionArea,
  styled,
  alpha,
} from '@bambu/react-ui';
import type { GoalType } from '@bambu/go-core';
import PrimaryGoalIcon from '../icons/PrimaryGoalIcon/PrimaryGoalIcon';

export interface DesktopGoalCardProps {
  selected?: boolean;
  description: string;
  goalType?: GoalType;
  onClick?: (goalType: GoalType) => void;
}

const StyledCardActionArea = styled(CardActionArea)<
  Pick<DesktopGoalCardProps, 'selected'>
>(({ theme, selected = false }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  ...(selected && {
    backgroundColor: `${alpha(theme.palette.primary.main, 0.2)}`,
    borderColor: theme.palette.primary.main,
  }),
}));

export function DesktopGoalCard({
  selected = false,
  description = 'description',
  goalType = 'Other',
  onClick,
}: DesktopGoalCardProps) {
  const handleClick = () => {
    onClick?.(goalType);
  };

  return (
    <Card>
      <StyledCardActionArea
        aria-label={`select ${goalType}`}
        selected={selected}
        onClick={handleClick}
      >
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-around">
            <PrimaryGoalIcon goalType={goalType} fontSize="large" />
          </Box>
          <Typography align="center">{description}</Typography>
        </Stack>
      </StyledCardActionArea>
    </Card>
  );
}

export default DesktopGoalCard;
