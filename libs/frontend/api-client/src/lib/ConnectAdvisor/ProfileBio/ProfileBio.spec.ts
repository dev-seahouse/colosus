import ConnectAdvisorProfileBioApi from './ProfileBio';

describe('ProfileBio', () => {
  const connectAdvisorProfileBioApi = new ConnectAdvisorProfileBioApi();

  describe('updateProfileSummaryContent()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorProfileBioApi.updateProfileSummaryContent(
        {
          richText: '<p>Hello world</p>',
        }
      );

      expect(res.status).toEqual(201);
    });
  });
});
