import { InvestorGetInvestorPlatformUserProfileResponseDto } from '@bambu/api-client';

export function hasNoKycAccount(
  profileData: InvestorGetInvestorPlatformUserProfileResponseDto
) {
  return !profileData.InvestorPlatformUsers[0].InvestorPlatformUserAccounts
    .length;
}
