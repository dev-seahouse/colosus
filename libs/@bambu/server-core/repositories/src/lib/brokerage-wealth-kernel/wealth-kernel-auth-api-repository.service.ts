import { IWealthKernelConfigDto } from '@bambu/server-core/configuration';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface IWealthKernelAuthenticationTokenDto {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export abstract class WealthKernelAuthApiRepositoryServiceBase {
  abstract GetToken(
    requestId: string,
    clientId: string,
    clientSecret: string
  ): Promise<IWealthKernelAuthenticationTokenDto>;
}

@Injectable()
export class WealthKernelAuthApiRepositoryService
  implements WealthKernelAuthApiRepositoryServiceBase
{
  private readonly logger: Logger = new Logger(
    WealthKernelAuthApiRepositoryService.name
  );
  private readonly baseUrl: string;

  constructor(
    private readonly config: ConfigService<IWealthKernelConfigDto>,
    private readonly httpService: HttpService
  ) {
    const wkConfig = this.config.getOrThrow('wealthKernelConfig', {
      infer: true,
    });
    const { authApiBaseUrl } = wkConfig;

    this.baseUrl = authApiBaseUrl;
  }

  async GetToken(
    requestId: string,
    clientId: string,
    clientSecret: string
  ): Promise<IWealthKernelAuthenticationTokenDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetToken.name,
      requestId
    );
    const loggingPayload = {
      clientId,
      clientSecret,
    };

    this.logger.debug(
      `${logPrefix} Start: ${JsonUtils.Stringify(loggingPayload)}`
    );

    try {
      const data = new URLSearchParams();
      data.append('grant_type', 'client_credentials');
      data.append('scope', 'wk.gateway');
      data.append('client_id', clientId);
      data.append('client_secret', clientSecret);

      const source = this.httpService.post(
        `${this.baseUrl}/connect/token`,
        data.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const response = await firstValueFrom(source);

      this.logger.debug(`${logPrefix} End: ${JsonUtils.Stringify(response)}`);

      return response.data;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Input values: ${JsonUtils.Stringify(loggingPayload)}.`,
          `Error: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );

      throw error;
    }
  }
}
