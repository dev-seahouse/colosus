import BambuApiLibraryIntegrationBaseApi from '../_Base/Base';
import type {
  IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
  IBambuApiLibraryCalculateRetirementGoalAmountResponseDto,
} from '@bambu/shared';

export type CalculateRetirementGoalAmountRequestDto =
  IBambuApiLibraryCalculateRetirementGoalAmountRequestDto;

export type CalculateRetirementGoalAmountResponseDto =
  IBambuApiLibraryCalculateRetirementGoalAmountResponseDto;

export { EnumBambuApiLibraryCalculateRetirementGoalAmountRequestGender as CalculateRetirementGoalAmountRequestGender } from '@bambu/shared';
export { EnumBambuApiLibraryCalculateRetirementGoalAmountRequestPeriod as CalculateRetirementGoalAmountRequestPeriod } from '@bambu/shared';

export class BambuApiLibraryIntegrationRetirementApi extends BambuApiLibraryIntegrationBaseApi {
  constructor(private readonly apiPath = 'retirement-apis') {
    super();
  }

  /**
   * Provide access to the Calculate Retirement Goal Amount API in Bambu API Library
   * - {@link http://localhost:9000/openapi#/Bambu%20API%20Library/BambuCalculatorsIntegrationController_CalculateRetirementGoalAmount}.
   */
  public async calculateRetirementGoalAmount(
    req: CalculateRetirementGoalAmountRequestDto
  ) {
    return await this.axios.post<CalculateRetirementGoalAmountResponseDto>(
      `${this.apiPath}/calculate-retirement-goal-amount`,
      req
    );
  }
}

export default BambuApiLibraryIntegrationRetirementApi;
