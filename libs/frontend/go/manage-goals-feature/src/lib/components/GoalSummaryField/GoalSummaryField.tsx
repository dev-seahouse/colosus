import { TwoColumnLayout } from '@bambu/go-core';
import { AnimatedLoadingText, Box, Typography } from '@bambu/react-ui';

interface GoalSummaryFieldProps {
  isLoading?: boolean;
  title: React.ReactNode;
  value: React.ReactNode;
  isHidden?: boolean;
}

// This component is used to render tile/value pattern in the GoalSummaryCard component
// it can be exported to go-core if this pattern repeats in other components
// when data is loading, this component will hide the placeholder value and show a loading animation
// to avoid confusing users with the placeholder value
// when data loading is done, it will show the actual value
// in case the value is not available, it will show the placeholder value passed in from
// parent into the value prop

export function GoalSummaryField({
  isLoading = false,
  title,
  value,
  isHidden,
}: GoalSummaryFieldProps) {
  if (isHidden) {
    return null;
  }
  return (
    <TwoColumnLayout>
      <Typography color="#8E918F" variant={'body2'}>
        {title}
      </Typography>
      <Box>
        {isLoading ? <AnimatedLoadingText /> : <Typography>{value}</Typography>}
      </Box>
    </TwoColumnLayout>
  );
}
export default GoalSummaryField;
