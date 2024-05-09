import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import type { SvgIcon, SvgIconProps } from '@bambu/react-ui';
import type { GoalType } from '@bambu/go-core';

const PRIMARY_ICONS: Record<GoalType, typeof SvgIcon> = {
  Retirement: GolfCourseIcon,
  Education: SchoolIcon,
  House: HomeIcon,
  'Growing Wealth': MonetizationOnIcon,
  Other: ModelTrainingIcon,
};

export interface PrimaryGoalIconProps extends SvgIconProps {
  goalType?: GoalType;
}

export function PrimaryGoalIcon({
  goalType = 'Other',
  ...rest
}: PrimaryGoalIconProps) {
  const Icon = PRIMARY_ICONS[goalType];

  return <Icon {...rest} />;
}

export default PrimaryGoalIcon;
