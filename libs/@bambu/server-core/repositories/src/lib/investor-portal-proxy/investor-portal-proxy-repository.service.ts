import { IInvestorPortalProxyConfigDto } from '@bambu/server-core/configuration';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export abstract class InvestorPortalProxyRepositoryServiceBase {
  public abstract get RemoteStorageUrl(): string;

  public abstract DownloadRemoteAsset(
    requestId: string,
    remoteUrl: string
  ): Promise<{
    responseHeaders: Record<string, unknown>;
    data: Buffer;
  }>;

  public abstract GetRemoteAssetHead(
    requestId: string,
    remoteUrl: string
  ): Promise<Record<string, unknown>>;
}

@Injectable()
export class InvestorPortalProxyRepositoryService
  implements InvestorPortalProxyRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(
    InvestorPortalProxyRepositoryService.name
  );
  readonly #baseUrl: string;

  constructor(
    private readonly config: ConfigService<IInvestorPortalProxyConfigDto>,
    private readonly httpService: HttpService
  ) {
    const configValues = this.config.getOrThrow('investorConfig', {
      infer: true,
    });
    this.#baseUrl = configValues.baseUrl;

    this.#logger.debug(`The storage base url is: ${this.#baseUrl}.`);
  }

  public get RemoteStorageUrl(): string {
    return this.#baseUrl;
  }

  public async DownloadRemoteAsset(
    requestId: string,
    remoteUrl: string
  ): Promise<{
    responseHeaders: Record<string, unknown>;
    data: Buffer;
  }> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.DownloadRemoteAsset.name,
      requestId
    );
    try {
      const source = this.httpService.get<Buffer>(remoteUrl, {
        responseType: 'arraybuffer',
        timeout: 5 * 60 * 1000,
      });
      const response = await firstValueFrom(source);
      const { headers, data } = response;
      return {
        responseHeaders: headers as Record<string, unknown>,
        data,
      };
    } catch (error) {
      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }

  public async GetRemoteAssetHead(
    requestId: string,
    remoteUrl: string
  ): Promise<Record<string, unknown>> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetRemoteAssetHead.name,
      requestId
    );
    try {
      const source = this.httpService.head(remoteUrl);
      const response = await firstValueFrom(source);
      return response.headers;
    } catch (error) {
      this.#logger.log(`${logPrefix} ${JsonUtils.Stringify(error)}`);
      throw error;
    }
  }
}
