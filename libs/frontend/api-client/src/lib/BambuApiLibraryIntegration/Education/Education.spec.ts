import BambuApiLibraryIntegrationEducationApi, {
  CalculateUniversityGoalAmountSpecialisation,
} from './Education';
import { CalculateUniversityGoalAmountUniversityTypeEnum } from './Education';

describe('Education', () => {
  const bambuApiLibraryIntegrationEducationApi =
    new BambuApiLibraryIntegrationEducationApi();
  const mockRequest = {
    age: 16,
    ageOfUni: 18,
    maxGoalYear: 24,
    universityType: CalculateUniversityGoalAmountUniversityTypeEnum.PUBLIC,
    country: 'US',
    inflationRate: 0.03,
    currentYear: 2018,
    specialisation: CalculateUniversityGoalAmountSpecialisation.GENERAL,
    state: 'Delaware',
    residencyType: 'instate',
  };

  describe('calculateUniversityGoalAmount', () => {
    it('should return a valid response', async () => {
      const res =
        await bambuApiLibraryIntegrationEducationApi.calculateUniversityGoalAmount(
          mockRequest
        );
      expect(res.data).toMatchSnapshot();
    });
  });
});
