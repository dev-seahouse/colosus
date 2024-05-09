import type { IInvestorPlatformProfileDto } from '@bambu/shared';
import TransactInvestorBaseApi from '../../_Base/Base';

/**
 * base type
 */
export type InvestorGetInvestorPlatformUserProfileResponseDto =
  IInvestorPlatformProfileDto;

/**
 * subtypes based from base type
 */
export type InvestorPlatformProfileGoals =
  InvestorGetInvestorPlatformUserProfileResponseDto['Goals'];

/**
 * enums
 */

export class TransactInvestorAuthenticatedProfileApi extends TransactInvestorBaseApi {
  constructor(private readonly apiPath = 'authenticated/profile') {
    super();
  }

  /**
   * Retrieves some user information associated with the investor.
   * - {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetInvestorPlatformUserProfile}
   */
  public async getInvestorPlatformUserProfile() {
    return this.axios.get<InvestorGetInvestorPlatformUserProfileResponseDto>(
      this.apiPath
    );
  }
}

export default TransactInvestorAuthenticatedProfileApi;
