import { goalStatusLabels } from './getGoalStatusLabel';

export type GoalStatusLabels = typeof goalStatusLabels;

export type GoalStatusLabelValues =
  GoalStatusLabels[keyof typeof goalStatusLabels];

export type GoalStatusLabelColor = Record<GoalStatusLabelValues, string>;
