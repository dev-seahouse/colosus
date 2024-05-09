import BambuApiLibraryIntegrationBaseApi from '../_Base/Base';
import type {
  IBambuApiLibraryCalculateHouseGoalAmountRequestDto,
  IBambuApiLibraryCalculateHouseGoalAmountResponseDto,
} from '@bambu/shared';

export type CalculateHouseGoalAmountRequestDto =
  IBambuApiLibraryCalculateHouseGoalAmountRequestDto;

export type CalculateHouseAmountResponseDto =
  IBambuApiLibraryCalculateHouseGoalAmountResponseDto;

export class BambuApiLibraryIntegrationHouseApi extends BambuApiLibraryIntegrationBaseApi {
  constructor(private readonly apiPath = 'house-apis') {
    super();
  }

  /**
   * Provide access to the Calculate Goal Amount API in Bambu API Library
   * - {@link http://localhost:9000/openapi#/Bambu%20API%20Library/CalculateHouseGoalAmount}.
   */
  public async calculateHouseGoalAmount(
    req: CalculateHouseGoalAmountRequestDto
  ) {
    return await this.axios.post<CalculateHouseAmountResponseDto>(
      `${this.apiPath}/calculate-house-goal-amount`,
      req
    );
  }
}

export default BambuApiLibraryIntegrationHouseApi;
