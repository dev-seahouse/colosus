// noinspection ES6PreferShortImport

import { IClientBambuApiLibraryConfigDto } from '@bambu/server-core/configuration';
import { IServerCoreIamClaimsDto } from '@bambu/server-core/dto';
import {
  BambuApiLibraryClientConfigRepositoryServiceBase,
  BambuApiLibraryCountriesRepositoryServiceBase,
  BambuApiLibraryEducationRepositoryServiceBase,
  BambuApiLibraryGraphRepositoryServiceBase,
  BambuApiLibraryHouseRepositoryServiceBase,
  BambuApiLibraryRetirementRepositoryServiceBase,
  BambuApiLibraryRiskProflingRepositoryServiceBase,
  IamClientRepositoryServiceBase,
  TenantCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  IBambuApiLibraryCalculateRiskPayloadDto,
  IBambuApiLibraryCalculateRiskScoreResponseDto,
  SharedEnums,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import * as _ from 'lodash';
import {
  BambuApiLibraryIntegrationDomainServiceBase,
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
} from './bambu-api-library-integration-domain-service.base';

@Injectable()
export class BambuApiLibraryIntegrationDomainService
  implements BambuApiLibraryIntegrationDomainServiceBase
{
  readonly #logger = new Logger(BambuApiLibraryIntegrationDomainService.name);

  constructor(
    private readonly graphApiRepository: BambuApiLibraryGraphRepositoryServiceBase,
    private readonly countriesApiRepository: BambuApiLibraryCountriesRepositoryServiceBase,
    private readonly houseApiRepository: BambuApiLibraryHouseRepositoryServiceBase,
    private readonly educationApiRepository: BambuApiLibraryEducationRepositoryServiceBase,
    private readonly retirementApiRepository: BambuApiLibraryRetirementRepositoryServiceBase,
    private readonly clientConfigRepository: BambuApiLibraryClientConfigRepositoryServiceBase,
    private readonly tenantCentralDbRepository: TenantCentralDbRepositoryService,
    private readonly iamRepository: IamClientRepositoryServiceBase,
    private readonly riskProfilingApiRepository: BambuApiLibraryRiskProflingRepositoryServiceBase
  ) {}

  async GetProjection(
    requestId: string,
    input: IBambuApiLibraryGetProjectionsRequestDto,
    investorClaims: IServerCoreIamClaimsDto | null
  ): Promise<IBambuApiLibraryGetProjectionsResponseDto> {
    try {
      const apiLibBearerToken: string =
        await this.#getAdvisorBambuApiLibraryApiKey(investorClaims, requestId);

      const clonedPayload =
        _.cloneDeep<IBambuApiLibraryGetProjectionsRequestDto>(input);

      const modelPortfolioIdMap = new Map<string, never>();

      clonedPayload.availablePortfolios = clonedPayload.availablePortfolios.map(
        (x, i) => {
          // TODO: Discuss with Ken about this weird shit
          // const modelPortfolioId = this.#remapUuidToInteger(x.modelPortfolioId);

          const modelPortfolioId = (i + 10) as never;
          const originalModelPortfolioId = x.modelPortfolioId;
          modelPortfolioIdMap.set(originalModelPortfolioId, modelPortfolioId);

          return {
            ...x,
            modelPortfolioId,
          };
        }
      );

      clonedPayload.inputs.modelPortfolioIdList =
        clonedPayload.inputs.modelPortfolioIdList.map((x) => {
          const currentId = x;

          if (modelPortfolioIdMap.has(currentId)) {
            return modelPortfolioIdMap.get(currentId);
          }

          const errorMessage: string = [
            `The modelPortfolioIdList id (${currentId}) does not tally with values available in the availablePortfolios list.`,
            `Values in availablePortfolios ${JSON.stringify(
              modelPortfolioIdMap,
              (key, value) => {
                if (value instanceof Map) {
                  return {
                    dataType: 'Map',
                    value: Array.from(value.entries()), // or with spread: value: [...value]
                  };
                } else {
                  return value;
                }
              }
            )}.`,
          ].join('');

          throw new Error(errorMessage);
        });

      return await this.graphApiRepository.GetProjections(
        clonedPayload,
        apiLibBearerToken
      );
    } catch (error) {
      this.#handleApiLibError(error, requestId);
    }
  }

  async #getAdvisorBambuApiLibraryApiKey(
    investorClaims: IServerCoreIamClaimsDto,
    requestId: string
  ): Promise<string> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.#getAdvisorBambuApiLibraryApiKey.name,
      requestId
    );

    this.#logger.log(`${logPrefix} Getting Bambu API Key for investor realm.`);

    if (this.ShouldWeUseBambuMasterKeyForEverything()) {
      this.#logger.log(
        `${logPrefix} Bypass using customer keys configuration is active. Using master key.`
      );

      const masterKey =
        this.clientConfigRepository.GetMasterApiLibraryKey(requestId);
      this.#logger.debug(`${logPrefix} Master key: (${masterKey}).`);

      return masterKey;
    }

    const realm = this.iamRepository.PredictRealmIdFromIssuer(
      investorClaims.iss
    );

    this.#logger.debug(
      `${logPrefix} Acquiring realm data for the ${realm} realm.`
    );

    const realmMetadata =
      await this.tenantCentralDbRepository.FindTenantByRealm(realm);

    if (!realmMetadata) {
      throw new Error(
        `Realm (${realm}) not configured for Bambu API Library integration.`
      );
    }

    this.#logger.debug(
      `${logPrefix} Acquired realm data for the ${realm} realm. Details ${JsonUtils.Stringify(
        realmMetadata
      )}.`
    );

    const { apiKeys } = realmMetadata;

    const bambuApiKey = apiKeys.find(
      (x) => x.keyType === SharedEnums.ApiKeyTypeEnum.BAMBU_API_LIB
    );

    if (bambuApiKey) {
      // TODO: Define interface for Bambu API config
      return (bambuApiKey.keyConfig as IClientBambuApiLibraryConfigDto).key;
    }

    throw new Error('User has no API key configured');
  }

  public ShouldWeUseBambuMasterKeyForEverything(): boolean {
    return this.clientConfigRepository.ShouldWeUseBambuMasterKeyForEverything();
  }

  // #remapUuidToInteger(uuid: string): number {
  //   return oneWayHashUuidToInt(uuid);
  // }

  async GetCountries(
    requestId: string,
    investorClaims: IServerCoreIamClaimsDto,
    countryAlpha2Code: string | null
  ): Promise<IBambuApiLibraryGetCountriesResponseDto[]> {
    try {
      const apiLibBearerToken = await this.#getAdvisorBambuApiLibraryApiKey(
        investorClaims,
        requestId
      );
      return await this.countriesApiRepository.GetCountries(
        apiLibBearerToken,
        countryAlpha2Code
      );
    } catch (error) {
      this.#handleApiLibError(error, requestId);
    }
  }

  async GetCountryRates(
    requestId: string,
    investorClaims: IServerCoreIamClaimsDto,
    countryAlpha2Code: string | null
  ): Promise<IBambuApiLibraryGetCountryRatesResponseDto[]> {
    try {
      const apiLibBearerToken = await this.#getAdvisorBambuApiLibraryApiKey(
        investorClaims,
        requestId
      );
      return await this.countriesApiRepository.GetCountryRates(
        apiLibBearerToken,
        countryAlpha2Code
      );
    } catch (error) {
      this.#handleApiLibError(error, requestId);
    }
  }

  async GetHouseGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateHouseGoalAmountRequestDto,
    investorClaims: IServerCoreIamClaimsDto
  ): Promise<IBambuApiLibraryCalculateHouseGoalAmountResponseDto> {
    try {
      const apiLibBearerToken = await this.#getAdvisorBambuApiLibraryApiKey(
        investorClaims,
        requestId
      );
      return await this.houseApiRepository.CalculateHouseGoalAmount(
        input,
        apiLibBearerToken
      );
    } catch (error) {
      this.#handleApiLibError(error, requestId);
    }
  }

  async CalculateUniversityGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateUniversityGoalAmountRequestDto,
    investorClaims: IServerCoreIamClaimsDto
  ): Promise<IBambuApiLibraryCalculateUniversityGoalAmountResponseDto> {
    try {
      const apiLibBearerToken = await this.#getAdvisorBambuApiLibraryApiKey(
        investorClaims,
        requestId
      );

      return await this.educationApiRepository.CalculateUniversityGoalAmount(
        input,
        apiLibBearerToken
      );
    } catch (error) {
      this.#handleApiLibError(error, requestId);
    }
  }

  public async CalculateRetirementGoalAmount(
    requestId: string,
    input: IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
    investorClaims: IServerCoreIamClaimsDto
  ): Promise<IBambuApiLibraryCalculateRetirementGoalAmountResponseDto> {
    try {
      const apiLibBearerToken = await this.#getAdvisorBambuApiLibraryApiKey(
        investorClaims,
        requestId
      );

      return await this.retirementApiRepository.CalculateRetirementGoalAmount(
        input,
        apiLibBearerToken
      );
    } catch (error) {
      this.#handleApiLibError(error, requestId);
    }
  }

  public async CalculateRiskScore(
    requestId: string,
    input: IBambuApiLibraryCalculateRiskPayloadDto,
    investorClaims: IServerCoreIamClaimsDto
  ): Promise<IBambuApiLibraryCalculateRiskScoreResponseDto> {
    try {
      const apiLibBearerToken = await this.#getAdvisorBambuApiLibraryApiKey(
        investorClaims,
        requestId
      );
      return await this.riskProfilingApiRepository.CalculateRiskScore(
        input,
        apiLibBearerToken
      );
    } catch (error) {
      this.#handleApiLibError(error, requestId);
    }
  }

  #handleApiLibError(error: Error | AxiosError, requestId: string) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const response = axiosError.response as AxiosResponse;
        if (response.data && response.data.message) {
          throw new ErrorUtils.ColossusError(
            response.data.message,
            requestId,
            { response },
            response.status,
            SharedEnums.ErrorCodes.GenericErrorCodesEnum.UNHANDLED
          );
        }
      }
    }
    throw error;
  }
}
