import type {
  IBambuApiLibraryGetCountriesResponseDto,
  IBambuApiLibraryGetCountryRatesResponseDto,
} from '@bambu/shared';
import BambuApiLibraryIntegrationBaseApi from '../_Base/Base';

export interface GetCountriesRequestDto {
  countryAlpha2Code?: string;
}

export type GetCountriesResponseDto = IBambuApiLibraryGetCountriesResponseDto[];

export interface GetCountryRatesRequestDto {
  countryAlpha2Code?: string;
}

export type GetCountryRatesResponseDto =
  IBambuApiLibraryGetCountryRatesResponseDto[];

export class BambuApiLibraryIntegrationCountryMetadataApi extends BambuApiLibraryIntegrationBaseApi {
  constructor(private readonly apiPath = '/country-metadata-apis') {
    super();
  }

  /**
   * To view a list of all the countries available in the platform and the dialing code, currency code
   *
   *  - {@link http://localhost:9000/openapi#/Bambu%20API%20Library/GetCountries GetCountries}
   */
  public async getCountries(req?: GetCountriesRequestDto) {
    return this.axios.get<GetCountriesResponseDto>(
      `${this.apiPath}/countries${
        req?.countryAlpha2Code
          ? `?countryAlpha2Code=${req.countryAlpha2Code}`
          : ''
      }`
    );
  }

  /**
   * Retrieves the general rate information of a country such as inflation rates, saving rates, life expectancy rates
   *
   *  - {@link http://localhost:9000/openapi#/Bambu%20API%20Library/GetCountryRates GetCountryRates}
   */
  public async getCountryRates(req?: GetCountryRatesRequestDto) {
    return this.axios.get<GetCountryRatesResponseDto>(
      `${this.apiPath}/country-rates${
        req?.countryAlpha2Code
          ? `?countryAlpha2Code=${req.countryAlpha2Code}`
          : ''
      }`
    );
  }
}

export default BambuApiLibraryIntegrationCountryMetadataApi;
