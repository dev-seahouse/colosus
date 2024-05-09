import BambuApiLibraryIntegrationRetirementApi, {
  CalculateRetirementGoalAmountRequestGender,
  CalculateRetirementGoalAmountRequestPeriod,
} from './Retirement';
import { describe } from 'vitest';

describe('RetirementApi', () => {
  const bambuApiLibraryIntegrationRetirementApi =
    new BambuApiLibraryIntegrationRetirementApi();

  describe('calculateRetirementGoalAmount', () => {
    it('should return a valid response', async () => {
      const res =
        await bambuApiLibraryIntegrationRetirementApi.calculateRetirementGoalAmount(
          {
            annualRetirementIncome: 95106.6,
            age: 50,
            retirementAge: 62,
            gender: CalculateRetirementGoalAmountRequestGender.MALE,
            lifeExpectancyMale: 81,
            lifeExpectancyFemale: 86,
            annualisedSavingsAcctIntR: 0.02,
            annualisedInflationRate: 0.017,
            compoundsPerYear: 1,
            period: CalculateRetirementGoalAmountRequestPeriod.END,
            country: 'US',
            additionalSource: {
              retirementSavings: 10000,
              socialSecurityBenefit: 800,
              pension: 1000,
              colaRate: 0.024,
            },
            calculateTax: true,
          }
        );
    });
  });
});
