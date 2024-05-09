// TODO: check if BE has enum later, move this go goal api-client
export const GoalTypeEnum = {
  Retirement: 'Retirement',
  Education: 'Education',
  House: 'House',
  'Growing Wealth': 'Growing Wealth',
  Other: 'Other',
} as const;

export type GoalType = (typeof GoalTypeEnum)[keyof typeof GoalTypeEnum];
