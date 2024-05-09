/**
 * Generate Goal Year Options
 */
export const generateGoalYearOptions = (noOfYears: number) => {
  const startingYear = new Date().getFullYear() + 1;

  return [...Array(noOfYears).keys()].map((i) => ({
    label: `${startingYear + i}`,
    value: startingYear + i,
  }));
};

export default generateGoalYearOptions;
