import { rest } from 'msw';
import type {
  IBambuApiLibraryCalculateHouseGoalAmountRequestDto,
  IBambuApiLibraryCalculateHouseGoalAmountResponseDto,
} from '@bambu/shared';

const BASE_URL =
  'http://localhost:9000/api/v1/bambu-api-library-integration/house-apis/';

/** args allows mocking different response based on request */
const response = (
  args?: IBambuApiLibraryCalculateHouseGoalAmountRequestDto
): IBambuApiLibraryCalculateHouseGoalAmountResponseDto => ({
  yearsToGoal: 6,
  houseCostInflationAdj: 297781163.32,
  currency: 'USD',
  downPaymentAmt: 89334348.99,
});

export const bambuApiLibraryIntegrationHouseApiHandlers = [
  rest.post(BASE_URL + 'calculate-house-goal-amount', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(response()));
  }),
];
