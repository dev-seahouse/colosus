/**
 * Truncate risk profile description to the first line before line break
 */
export const truncateRiskProfileDescriptionBeforeLineBreak = (
  description: string
) => description.split('<br/>')[0];
