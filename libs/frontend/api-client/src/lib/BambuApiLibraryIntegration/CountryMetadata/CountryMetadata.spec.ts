import BambuApiLibraryIntegrationCountryMetadataApi from './CountryMetadata';

describe('CountryMetadataApi', () => {
  const bambuApiLibraryIntegrationCountryMetadataApi =
    new BambuApiLibraryIntegrationCountryMetadataApi();
  describe('getCountries', () => {
    it('should return a valid response', async () => {
      const res =
        await bambuApiLibraryIntegrationCountryMetadataApi.getCountries();

      expect(res.data).toMatchSnapshot();
    });
  });

  describe('getCountryRates', () => {
    it('should return a valid response', async () => {
      const res =
        await bambuApiLibraryIntegrationCountryMetadataApi.getCountryRates();

      expect(res.data).toMatchSnapshot();
    });

    it('should return specific country data if countryAlpha2Code is provided', async () => {
      const res =
        await bambuApiLibraryIntegrationCountryMetadataApi.getCountryRates({
          countryAlpha2Code: 'US',
        });

      expect(res.data.length).toEqual(1);
    });
  });
});
