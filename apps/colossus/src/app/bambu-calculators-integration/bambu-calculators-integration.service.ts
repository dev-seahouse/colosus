import { BambuApiLibraryIntegrationDomainServiceBase } from '@bambu/server-core/domains';

import {
  IColossusHttpRequestDto,
  IServerCoreIamClaimsDto,
} from '@bambu/server-core/dto';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  IBambuApiLibraryCalculateHouseGoalAmountRequestDto,
  IBambuApiLibraryCalculateHouseGoalAmountResponseDto,
  IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
  IBambuApiLibraryCalculateRetirementGoalAmountResponseDto,
  IBambuApiLibraryCalculateUniversityGoalAmountRequestDto,
  IBambuApiLibraryCalculateUniversityGoalAmountResponseDto,
  IBambuApiLibraryGetCountriesResponseDto,
  IBambuApiLibraryGetCountryRatesResponseDto,
  IBambuApiLibraryGetProjectionsRequestDto,
  IBambuApiLibraryGetProjectionsResponseDto,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';

export abstract class BambuCalculatorsIntegrationServiceBase {
  abstract GetProjections(
    requestId: string,
    input: IBambuApiLibraryGetProjectionsRequestDto,
    httpRequest: IColossusHttpRequestDto
  ): Promise<IBambuApiLibraryGetProjectionsResponseDto>;

  abstract GetCountries(
    requestId: string,
    httpRequest: IColossusHttpRequestDto,
    countryAlpha2Code: string | null
  ): Promise<IBambuApiLibraryGetCountriesResponseDto[]>;

  abstract GetCountryRates(
    requestId: string,
    httpRequest: IColossusHttpRequestDto,
    countryAlpha2Code: string | null
  ): Promise<IBambuApiLibraryGetCountryRatesResponseDto[]>;

  abstract CalculateHouseGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateHouseGoalAmountRequestDto,
    httpRequest: IColossusHttpRequestDto
  ): Promise<IBambuApiLibraryCalculateHouseGoalAmountResponseDto>;

  abstract CalculateUniversityGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateUniversityGoalAmountRequestDto,
    httpRequest: IColossusHttpRequestDto
  ): Promise<IBambuApiLibraryCalculateUniversityGoalAmountResponseDto>;

  abstract CalculateRetirementGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
    httpRequest: IColossusHttpRequestDto
  ): Promise<IBambuApiLibraryCalculateRetirementGoalAmountResponseDto>;
}

@Injectable()
export class BambuCalculatorsIntegrationService
  implements BambuCalculatorsIntegrationServiceBase
{
  readonly #logger: Logger = new Logger(
    BambuCalculatorsIntegrationService.name
  );

  constructor(
    private readonly apiLibDomain: BambuApiLibraryIntegrationDomainServiceBase
  ) {}

  public async GetProjections(
    requestId: string,
    input: IBambuApiLibraryGetProjectionsRequestDto,
    httpRequest: IColossusHttpRequestDto
  ): Promise<IBambuApiLibraryGetProjectionsResponseDto> {
    const claims = this.#getAccessTokenFromHttpRequest(httpRequest, requestId);
    return await this.apiLibDomain.GetProjection(requestId, input, claims);
  }

  #getAccessTokenFromHttpRequest(
    httpRequest: IColossusHttpRequestDto,
    requestId: string
  ): IServerCoreIamClaimsDto | null {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#getAccessTokenFromHttpRequest.name,
      requestId
    );

    if (this.apiLibDomain.ShouldWeUseBambuMasterKeyForEverything()) {
      this.#logger.verbose(
        `${logPrefix} Bypass of claims checking is active in settings. Bypassing claims check.`
      );
      return null;
    }

    this.#logger.debug(
      `${logPrefix} Deriving claims from http request. Details: ${JsonUtils.Stringify(
        httpRequest
      )}.`
    );

    const { claims } = httpRequest;

    if (!claims) {
      throw ErrorUtils.getDefaultMissingClaimsError(
        requestId,
        null,
        'Unable to access claims from request authorization token.'
      );
    }

    return claims;
  }

  public async GetCountries(
    requestId: string,
    httpRequest: IColossusHttpRequestDto,
    countryAlpha2Code: string | null
  ): Promise<IBambuApiLibraryGetCountriesResponseDto[]> {
    const token = this.#getAccessTokenFromHttpRequest(httpRequest, requestId);
    return await this.apiLibDomain.GetCountries(
      requestId,
      token,
      countryAlpha2Code
    );
  }

  public async GetCountryRates(
    requestId: string,
    httpRequest: IColossusHttpRequestDto,
    countryAlpha2Code: string | null
  ): Promise<IBambuApiLibraryGetCountryRatesResponseDto[]> {
    const token = this.#getAccessTokenFromHttpRequest(httpRequest, requestId);
    return await this.apiLibDomain.GetCountryRates(
      requestId,
      token,
      countryAlpha2Code
    );
  }

  public async CalculateHouseGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateHouseGoalAmountRequestDto,
    httpRequest: IColossusHttpRequestDto
  ): Promise<IBambuApiLibraryCalculateHouseGoalAmountResponseDto> {
    const token = this.#getAccessTokenFromHttpRequest(httpRequest, requestId);
    return await this.apiLibDomain.GetHouseGoalAmount(requestId, input, token);
  }

  public async CalculateUniversityGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateUniversityGoalAmountRequestDto,
    httpRequest: IColossusHttpRequestDto
  ): Promise<IBambuApiLibraryCalculateUniversityGoalAmountResponseDto> {
    const token = this.#getAccessTokenFromHttpRequest(httpRequest, requestId);
    return await this.apiLibDomain.CalculateUniversityGoalAmount(
      requestId,
      input,
      token
    );
  }

  public async CalculateRetirementGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
    httpRequest: IColossusHttpRequestDto
  ): Promise<IBambuApiLibraryCalculateRetirementGoalAmountResponseDto> {
    const token = this.#getAccessTokenFromHttpRequest(httpRequest, requestId);
    return await this.apiLibDomain.CalculateRetirementGoalAmount(
      requestId,
      input,
      token
    );
  }
}
