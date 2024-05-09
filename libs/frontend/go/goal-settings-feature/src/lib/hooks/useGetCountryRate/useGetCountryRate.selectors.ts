import { useQuery } from '@tanstack/react-query';

import { getCountryRateQuery } from './useGetCountryRate';
import type { GetCountryRateData } from './useGetCountryRate';

/**
 * hook to get life expectancy and interest rate data
 */
export const useSelectLifeExpectancyAndInterestQuery = () => {
  return useQuery({
    ...getCountryRateQuery('US'),
    select: (data: GetCountryRateData) => {
      if (!data || !data.length) return null;

      return {
        lifeExpectancyMale: data[0].lifeExpectancyMale,
        lifeExpectancyFemale: data[0].lifeExpectancyFemale,
        annualisedSavingsAcctIntR: data[0].savingsAccountInterestRate,
        annualisedInflationRate: data[0].inflationRateLongTerm,
      };
    },
  });
};

/**
 * hook to get life expectancy and interest rate data
 */
export const useSelectInflationRateQuery = () => {
  return useQuery({
    ...getCountryRateQuery('US'),
    select: (data: GetCountryRateData) => {
      if (!data || !data.length) return 0;

      return data[0].inflationRateLongTerm;
    },
  });
};
