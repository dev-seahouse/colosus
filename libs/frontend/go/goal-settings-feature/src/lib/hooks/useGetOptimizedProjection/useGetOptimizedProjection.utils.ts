import type { GetProjectionsRequestDto } from '@bambu/api-client';
import { GetProjectionsCompoundingEnums } from '@bambu/api-client';
import type { GetModelPortfoliosData } from '@bambu/go-core';
import { useCoreStore } from '@bambu/go-core';
import { DateTime } from 'luxon';

export const composeAvailablePortfolios = (
  modelPortfolios: GetModelPortfoliosData
): GetProjectionsRequestDto['availablePortfolios'] =>
  modelPortfolios.map((modelPortfolio) => ({
    discreteExpectedMean: Number(modelPortfolio.expectedReturnPercent) / 100,
    modelPortfolioId: modelPortfolio.id as string,
    discreteExpectedStandardDeviation:
      Number(modelPortfolio.expectedVolatilityPercent) / 100,
  }));

export const composeInputs = (modelPortfolios: GetModelPortfoliosData) => {
  const { goal, riskProfileId } = useCoreStore.getState();
  const DATE_FORMAT = 'yyyy-MM-dd';

  const modelPortfolio = modelPortfolios.find(
    (m) => m.riskProfileId === riskProfileId
  );

  if (!modelPortfolio) throw new Error('Model portfolio not found.');

  return {
    startDate: DateTime.now().toFormat(DATE_FORMAT),
    endDate: DateTime.now()
      .plus({ years: goal?.goalTimeframe ?? 1 })
      .toFormat(DATE_FORMAT),
    compounding: GetProjectionsCompoundingEnums.YEARLY, // yearly to improve performance
    confidenceInterval: 0.67,
    grossInitialInvestment: goal.initialInvestment ?? 0,
    currentWealth: 0,
    frontEndFees: 0,
    backEndFees: 0,
    managementFees: [0],
    grossGoalAmount:
      goal.goalType === 'Growing Wealth' ? 5 : (goal.goalValue as number), // wealthGoal does not have goal target=goalValue
    modelPortfolioIdList: [modelPortfolio?.id],
    infusions: [0],
    targetProbability: 0.5,
  };
};

export const getDefaultRecommendationSelection =
  (): GetProjectionsRequestDto['recommendationSelection'] => ({
    shortfallRecommendation: {
      initialInvestment: false,
      constantInfusion: true,
      dynamicIncreasingInfusion: false,
      dynamicDecreasingInfusion: false,
      goalAmount: false,
      goalYear: false,
    },
    surplusRecommendation: {
      glidePath: {
        glidePath: false,
        portfolioDerisking: false,
        deriskStartDate: '2015-01-02',
        deriskEndDate: '2019-01-03',
      },
    },
  });
