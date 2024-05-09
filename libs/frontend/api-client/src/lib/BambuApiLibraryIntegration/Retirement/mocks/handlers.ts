import { rest } from 'msw';
import type {
  IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
  IBambuApiLibraryCalculateRetirementGoalAmountResponseDto,
} from '@bambu/shared';

const BASE_URL =
  'http://localhost:9000/api/v1/bambu-api-library-integration/retirement-apis/';

const calculateRetirementGoalAmountResponse = (
  args?: IBambuApiLibraryCalculateRetirementGoalAmountRequestDto
): IBambuApiLibraryCalculateRetirementGoalAmountResponseDto => ({
  goalAmount: 1612818,
  totalRetirementExpenditure: 2056210.3,
  workingPeriod: 12,
  yearsToDecumulate: 20,
  retirementAssets: {
    totalSocialSecurityBenefits: 195415.77,
    totalPension: 235294.11,
    totalRetirementSavings: 12682.42,
    totalAssets: 443392.3,
  },
});
export const bambuApiLibraryIntegrationRetirementApiHandlers = [
  rest.post(BASE_URL + 'calculate-retirement-goal-amount', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(calculateRetirementGoalAmountResponse())
    );
  }),
];
