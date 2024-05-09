import BambuApiLibraryIntegrationHouseApi from './House';

describe('HouseApi', () => {
  const mockRequest = {
    downPaymentYear: 2021,
    country: 'USA',
    region: 'Ohio',
    city: 'Akron',
    houseType: 'One Bed',
    downPaymentPct: 0.3,
    inflationRate: 0.05,
    currentYear: 2020,
    location: '',
    district: '',
    roomType: '',
  };

  describe('calculateHouseGoalAmount', () => {
    const bambuApiLibraryIntegrationHouseApi =
      new BambuApiLibraryIntegrationHouseApi();
    it('should return a valid response', async () => {
      const res =
        await bambuApiLibraryIntegrationHouseApi.calculateHouseGoalAmount(
          mockRequest
        );
      expect(res.data).toMatchSnapshot();
    });
  });
});
