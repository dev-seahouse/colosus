import ConnectAdvisorContactMeApi from './ContactMe';

describe('ConnectAdvisorContactMeApi', () => {
  const connectAdvisorContactMeApi = new ConnectAdvisorContactMeApi();

  describe('getTenantBranding()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorContactMeApi.updateContactMeContent({
        richText: '<p>Hello world</p>',
      });

      expect(res.status).toEqual(201);
    });
  });
});
