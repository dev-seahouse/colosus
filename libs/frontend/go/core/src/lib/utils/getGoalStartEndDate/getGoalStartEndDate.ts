import { DateTime } from 'luxon';

// default start date is today, default end date is today + goalTimeFrame
export const getDefaultGoalStartEndDate = (goalTimeFrame: number) => {
  if (goalTimeFrame == null) {
    throw new Error('goalTimeFrame is nullish at runtime');
  }
  return {
    startDate: DateTime.now(),
    endDate: DateTime.now().plus({ years: goalTimeFrame }),
  };
};
