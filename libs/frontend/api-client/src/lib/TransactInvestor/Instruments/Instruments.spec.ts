import { TransactInvestorInstrumentsApi } from './Instruments';

describe('TransactInvestorInstrumentsApi', () => {
  const instrumentsApi = new TransactInvestorInstrumentsApi();
  test('getInstruments', () => {
    it('should return a valid response', async () => {
      const res = await instrumentsApi.getInstruments({
        pageIndex: 1,
        pageSize: 10,
        searchString: 'string',
      });
      expect(res.data).toBeDefined();
    });
  });

  test('getInstrumentAssetClasses', () => {
    it('should return a valid response', async () => {
      const res = await instrumentsApi.getInstrumentAssetClasses();
      expect(res.data).toBeDefined();
    });
  });
});
