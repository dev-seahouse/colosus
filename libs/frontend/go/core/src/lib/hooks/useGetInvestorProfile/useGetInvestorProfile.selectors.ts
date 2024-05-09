import { InvestorGetInvestorPlatformUserProfileResponseDto } from '@bambu/api-client';

export const selectGoalById =
  (goalId: string) =>
  (
    data: InvestorGetInvestorPlatformUserProfileResponseDto | undefined | null
  ) =>
    data?.Goals?.find((g) => g.id === goalId);
