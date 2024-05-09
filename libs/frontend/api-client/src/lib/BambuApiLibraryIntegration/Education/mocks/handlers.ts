import type {
  IBambuApiLibraryCalculateHouseGoalAmountRequestDto,
  IBambuApiLibraryCalculateUniversityGoalAmountResponseDto,
} from '@bambu/shared';
import { rest } from 'msw';

const BASE_URL =
  'http://localhost:9000/api/v1/bambu-api-library-integration/education-apis/';

const response = (
  args?: IBambuApiLibraryCalculateHouseGoalAmountRequestDto
): IBambuApiLibraryCalculateUniversityGoalAmountResponseDto => ({
  goalYear: 2020,
  yearsToGoal: 2,
  maxYearsToGoal: 8,
  educationCost: 155502,
  universityCost: 146576,
  currency: 'USD',
});

export const bambuApiLibraryIntegrationEducationApiHandlers = [
  rest.post(BASE_URL + 'calculate-university-goal-amount', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(response()));
  }),
];
