import ConnectAdvisorProfileApi from './Profile';

describe('Profile', () => {
  const connectAdvisorProfileApi = new ConnectAdvisorProfileApi();

  describe('getProfile()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorProfileApi.getProfile();

      expect(res.data).toMatchSnapshot();
    });
  });

  describe('updateProfile()', () => {
    it('should return a valid response', async () => {
      const res = await connectAdvisorProfileApi.updateProfile({
        firstName: 'Benjamin',
        lastName: 'The Beast',
        businessName: 'Door',
        jobTitle: 'Chief of Mischief',
        countryOfResidence: 'USA',
        region: 'MI',
      });

      expect(res.status).toEqual(204);
    });
  });

  describe('uploadAdvisorPublicProfilePicture()', () => {
    it('should return a valid response', async () => {
      const res =
        await connectAdvisorProfileApi.uploadAdvisorPublicProfilePicture(
          new FormData()
        );

      expect(res.status).toEqual(204);
    });
  });

  describe('uploadAdvisorInternalProfilePicture()', () => {
    it('should return a valid response', async () => {
      const res =
        await connectAdvisorProfileApi.uploadAdvisorInternalProfilePicture(
          new FormData()
        );

      expect(res.status).toEqual(204);
    });
  });

  describe('deleteAdvisorPublicProfilePicture()', () => {
    it('should return a valid response', async () => {
      const res =
        await connectAdvisorProfileApi.deleteAdvisorPublicProfilePicture();

      expect(res.status).toEqual(204);
    });
  });

  describe('deleteAdvisorInternalProfilePicture()', () => {
    it('should return a valid response', async () => {
      const res =
        await connectAdvisorProfileApi.deleteAdvisorInternalProfilePicture();

      expect(res.status).toEqual(204);
    });
  });
});
