import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { JsonUtils } from '@bambu/server-core/utilities';
import * as _ from 'lodash';
import { firstValueFrom } from 'rxjs';
import {
  IBambuApiLibraryCalculateRiskScoreRequestDto,
  IBambuApiLibraryCalculateRiskScoreResponseDto,
  IBambuApiLibraryCalculateRiskPayloadDto,
} from '@bambu/shared';
import { IRestApiIntegrationBaseConfigDto } from '@bambu/server-core/configuration';

export abstract class BambuApiLibraryRiskProflingRepositoryServiceBase {
  public abstract CalculateRiskScore(
    input: IBambuApiLibraryCalculateRiskPayloadDto,
    bearerToken: string
  ): Promise<IBambuApiLibraryCalculateRiskScoreResponseDto>;
}

@Injectable()
export class BambuApiLibraryRiskProflingRepositoryService
  implements BambuApiLibraryRiskProflingRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(
    BambuApiLibraryRiskProflingRepositoryService.name
  );
  readonly #baseUrl: string;

  constructor(
    private readonly config: ConfigService<IRestApiIntegrationBaseConfigDto>,
    private readonly httpService: HttpService
  ) {
    this.#baseUrl = this.config.get('baseUrl', { infer: true }) as string;

    this.#logger.debug(`The baseUrl set is ${this.#baseUrl}`);
  }

  public async CalculateRiskScore(
    input: IBambuApiLibraryCalculateRiskPayloadDto,
    bearerToken: string
  ): Promise<IBambuApiLibraryCalculateRiskScoreResponseDto> {
    const logPrefix = `${this.CalculateRiskScore.name} -`;
    try {
      const url = `${this.#baseUrl}/api/riskProfiling/v2/calcRiskScore`;
      const loggerPayload = {
        input,
        bearerToken,
        url,
      };
      this.#logger.debug(
        `${logPrefix} Calling API with following parameters: ${JsonUtils.Stringify(
          loggerPayload
        )}`
      );
      const source = this.httpService.post(url, input, {
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
