import BambuApiLibraryIntegrationBaseApi from '../_Base/Base';
import type {
  IBambuApiLibraryCalculateUniversityGoalAmountRequestDto,
  IBambuApiLibraryCalculateUniversityGoalAmountResponseDto,
} from '@bambu/shared';
import {
  EnumBambuApiLibraryCalculateUniversityGoalAmountRequestSpecialisation,
  EnumBambuApiLibraryCalculateUniversityGoalAmountRequestUniversityType,
} from '@bambu/shared';

export type CalculateUniversityGoalAmountRequestDto =
  IBambuApiLibraryCalculateUniversityGoalAmountRequestDto;

export type CalculateUniversityGoalAmountResponseDto =
  IBambuApiLibraryCalculateUniversityGoalAmountResponseDto;

export { EnumBambuApiLibraryCalculateUniversityGoalAmountRequestUniversityType as CalculateUniversityGoalAmountUniversityTypeEnum };

export { EnumBambuApiLibraryCalculateUniversityGoalAmountRequestSpecialisation as CalculateUniversityGoalAmountSpecialisation };

export class BambuApiLibraryIntegrationEducationApi extends BambuApiLibraryIntegrationBaseApi {
  constructor(private readonly apiPath = 'education-apis') {
    super();
  }

  /**
   * Provide access to the Calculate Education Goal Amount API in Bambu API Library
   * - {@link http://localhost:9000/openapi#/Bambu%20API%20Library/CalculateUniversityGoalAmount}.
   */
  public async calculateUniversityGoalAmount(
    req: CalculateUniversityGoalAmountRequestDto
  ) {
    return await this.axios.post<CalculateUniversityGoalAmountResponseDto>(
      `${this.apiPath}/calculate-university-goal-amount`,
      req
    );
  }
}

export default BambuApiLibraryIntegrationEducationApi;
