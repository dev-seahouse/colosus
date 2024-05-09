import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as _ from 'lodash';

import { IRestApiIntegrationBaseConfigDto } from '@bambu/server-core/configuration';
import { JsonUtils } from '@bambu/server-core/utilities';

import {
  IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
  IBambuApiLibraryCalculateRetirementGoalAmountResponseDto,
} from '@bambu/shared';

export abstract class BambuApiLibraryRetirementRepositoryServiceBase {
  abstract CalculateRetirementGoalAmount(
    input: IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
    bearerToken: string
  ): Promise<IBambuApiLibraryCalculateRetirementGoalAmountResponseDto>;
}

@Injectable()
export class BambuApiLibraryRetirementRepositoryService
  implements BambuApiLibraryRetirementRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(
    BambuApiLibraryRetirementRepositoryService.name
  );
  readonly #baseUrl: string;

  constructor(
    private readonly config: ConfigService<IRestApiIntegrationBaseConfigDto>,
    private readonly httpService: HttpService
  ) {
    this.#baseUrl = this.config.get('baseUrl', { infer: true }) as string;

    this.#logger.debug(`The baseUrl set is ${this.#baseUrl}`);
  }

  public async CalculateRetirementGoalAmount(
    input: IBambuApiLibraryCalculateRetirementGoalAmountRequestDto,
    bearerToken: string
  ): Promise<IBambuApiLibraryCalculateRetirementGoalAmountResponseDto> {
    const logPrefix = `${this.CalculateRetirementGoalAmount.name} -`;
    try {
      const url = `${
        this.#baseUrl
      }/api/generalCalculator/v2/goalCalculator/calcRetirementGoalAmount`;
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
