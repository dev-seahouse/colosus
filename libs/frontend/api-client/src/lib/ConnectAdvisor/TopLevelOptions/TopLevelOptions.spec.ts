import ConnectAdvisorTopLevelOptionsApi from './TopLevelOptions';

describe('TopLevelOptions', () => {
  const connectAdvisorTopLevelOptionsApi =
    new ConnectAdvisorTopLevelOptionsApi();

  describe('getTopLevelOptions()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorTopLevelOptionsApi.getTopLevelOptions();

      expect(res.data).toMatchSnapshot();
    });
  });

  describe('updateTopLevelOptions()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorTopLevelOptionsApi.updateTopLevelOptions({
        incomeThreshold: 10000,
        retireeSavingsThreshold: 10000,
      });

      expect(res.status).toEqual(200);
    });
  });
});
