import { GoalStatusEnum } from '@bambu/shared';

export const goalStatusLabels = {
  [GoalStatusEnum.PENDING]: 'Inactive',
  [GoalStatusEnum.CREATED]: 'In Progress',
  [GoalStatusEnum.ACTIVE]: 'Active',
  [GoalStatusEnum.CLOSED]: 'Closed',
  [GoalStatusEnum.CLOSING]: 'Closing',
  UNKNOWN: 'Unknown',
} as const;

export function getGoalStatusLabel(status: GoalStatusEnum) {
  if (status in goalStatusLabels) {
    return goalStatusLabels[status];
  }
  console.error('Unknown goal status: ', status);
  return goalStatusLabels.UNKNOWN;
}
