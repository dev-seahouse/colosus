import { getValidDateOrFallBack } from '../getValidDateOrFallBack/getValidDateOrFallBack';
import { getDefaultGoalStartEndDate } from '../getGoalStartEndDate/getGoalStartEndDate';

export function getGoalEndDate(
  goalEndDateISOFromApi: unknown,
  goalTimeframe: number
) {
  return getValidDateOrFallBack(
    goalEndDateISOFromApi,
    getDefaultGoalStartEndDate(goalTimeframe).endDate.toISO()
  );
}

export default getGoalEndDate;
