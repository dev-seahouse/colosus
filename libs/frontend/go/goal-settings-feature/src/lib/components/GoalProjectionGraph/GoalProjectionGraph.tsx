import { ProjectionGraph, styled } from '@bambu/react-ui';
import { useSelectGoalType, useSelectGoalValue } from '@bambu/go-core';
import type { ProjectionGraphProps } from '@bambu/react-ui';

const GraphContainer = styled('div')(({ theme }) => ({
  height: 400,
  [theme.breakpoints.down('md')]: {
    height: 225,
  },
}));

export interface GoalProjectionGraphProps {
  data: ProjectionGraphProps['data'];
}

export function GoalProjectionGraph({ data }: GoalProjectionGraphProps) {
  const goalValue = useSelectGoalValue();
  const goalType = useSelectGoalType();

  return (
    <GraphContainer>
      <ProjectionGraph
        data={data}
        goalTargetValue={goalValue}
        ReferenceLineProps={{
          label: goalType === 'Growing Wealth' ? 'Potential growth' : undefined,
        }}
        goalType={goalType}
      />
    </GraphContainer>
  );
}

export default GoalProjectionGraph;
