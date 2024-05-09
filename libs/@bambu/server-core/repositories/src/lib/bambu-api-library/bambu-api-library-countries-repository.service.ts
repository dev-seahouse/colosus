import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as _ from 'lodash';
import {
  IBambuApiLibraryGetCountriesResponseDto,
  IBambuApiLibraryGetCountryRatesResponseDto,
} from '@bambu/shared';

import { IRestApiIntegrationBaseConfigDto } from '@bambu/server-core/configuration';
import { JsonUtils } from '@bambu/server-core/utilities';

export abstract class BambuApiLibraryCountriesRepositoryServiceBase {
  abstract GetCountries(
    bearerToken: string,
    countryAlpha2Code?: string | null
  ): Promise<IBambuApiLibraryGetCountriesResponseDto[]>;

  abstract GetCountryRates(
    bearerToken: string,
    countryAlpha2Code?: string | null
  ): Promise<IBambuApiLibraryGetCountryRatesResponseDto[]>;
}

@Injectable()
export class BambuApiLibraryCountriesRepositoryService {
  readonly #logger: Logger = new Logger(
    BambuApiLibraryCountriesRepositoryService.name
  );
  readonly #baseUrl: string;

  constructor(
    private readonly config: ConfigService<IRestApiIntegrationBaseConfigDto>,
    private readonly httpService: HttpService
  ) {
    this.#baseUrl = this.config.get('baseUrl', { infer: true }) as string;

    this.#logger.debug(`The baseUrl set is ${this.#baseUrl}`);
  }

  public async GetCountries(
    bearerToken: string,
    countryAlpha2Code?: string | null
  ): Promise<IBambuApiLibraryGetCountriesResponseDto[]> {
    const logPrefix = `${this.GetCountries.name} -`;

    try {
      const rawUrl = [this.#baseUrl, '/api/country/v2/countries'];

      if (
        countryAlpha2Code &&
        typeof countryAlpha2Code === 'string' &&
        countryAlpha2Code.trim() !== ''
      ) {
        rawUrl.push(`?countryCode=${countryAlpha2Code}`);
      }

      const url = rawUrl.join('');

      const loggerPayload = {
        bearerToken,
        url,
      };

      this.#logger.debug(
        `${logPrefix} Calling API with following parameters: ${JsonUtils.Stringify(
          loggerPayload
        )}`
      );

      const source = this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      const response = await firstValueFrom(source);

      const data = _.cloneDeep(response.data);

      this.#logger.debug(
        [
          `${logPrefix} Data Retrieved: ${JsonUtils.Stringify(data)}.`,
          `Input values: ${JsonUtils.Stringify(loggerPayload)}`,
        ].join(' ')
      );

      return data;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async GetCountryRates(
    bearerToken: string,
    countryAlpha2Code?: string | null
  ): Promise<IBambuApiLibraryGetCountryRatesResponseDto[]> {
    const logPrefix = `${this.GetCountryRates.name} -`;

    try {
      const rawUrl = [this.#baseUrl, '/api/country/v2/rates'];

      if (
        countryAlpha2Code &&
        typeof countryAlpha2Code === 'string' &&
        countryAlpha2Code.trim() !== ''
      ) {
        rawUrl.push(`?countryCode=${countryAlpha2Code}`);
      }

      const url = rawUrl.join('');

      const loggerPayload = {
        bearerToken,
        url,
      };

      this.#logger.debug(
        `${logPrefix} Calling API with following parameters: ${JsonUtils.Stringify(
          loggerPayload
        )}`
      );

      const source = this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      const response = await firstValueFrom(source);

      const data = _.cloneDeep(response.data);

      this.#logger.debug(
        [
          `${logPrefix} Data Retrieved: ${JsonUtils.Stringify(data)}.`,
          `Input values: ${JsonUtils.Stringify(loggerPayload)}`,
        ].join(' ')
      );

      return data;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }
}
