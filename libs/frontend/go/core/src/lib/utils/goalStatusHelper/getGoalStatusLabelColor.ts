import type { GoalStatusLabelColor, GoalStatusLabelValues } from './types';

export const GOAL_STATUS_COLORS: GoalStatusLabelColor = {
  Inactive: '#7295AA',
  Active: '#50B798',
  'In Progress': '#EB7202',
  Closed: '#7295aa',
  Closing: '#7295aa',
  Unknown: '#7295aa',
};

export function getGoalStatusLabelColor(status: GoalStatusLabelValues) {
  if (status in GOAL_STATUS_COLORS) {
    return GOAL_STATUS_COLORS[status];
  }
  console.error('Unknown goal status: ', status);
  return GOAL_STATUS_COLORS.Unknown;
}
