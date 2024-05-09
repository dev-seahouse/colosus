// check out https://bambulife.atlassian.net/browse/BAM-857
// basically, if recommended rsp < MIN_RECURRING_DEPOSIT, default recommendation to MIN_RECURRING_DEPOSIT
export function getNormalizedRecommendedRsp(
  recommendation: number,
  minRecurringDeposit = 25
) {
  return recommendation < minRecurringDeposit
    ? minRecurringDeposit
    : recommendation;
}
