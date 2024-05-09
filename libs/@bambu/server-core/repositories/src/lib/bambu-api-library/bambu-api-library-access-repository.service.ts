import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LoggingUtils, PromiseUtils } from '@bambu/server-core/utilities';

import {
  IBambuApiLibraryIntegrationConfigDto,
  IClientBambuApiLibraryConfigDto,
} from '@bambu/server-core/configuration';

export abstract class BambuApiLibraryAccessRepositoryServiceBase {
  public abstract ProvisionApiKey(
    requestId: string
  ): Promise<IClientBambuApiLibraryConfigDto>;
}

@Injectable()
export class BambuApiLibraryAccessRepositoryService
  implements BambuApiLibraryAccessRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(
    BambuApiLibraryAccessRepositoryService.name
  );

  constructor(
    private readonly config: ConfigService<IBambuApiLibraryIntegrationConfigDto>
  ) {}

  public async ProvisionApiKey(
    requestId: string
  ): Promise<IClientBambuApiLibraryConfigDto> {
    const loggingPrefix = LoggingUtils.generateLogPrefix(
      this.ProvisionApiKey.name,
      requestId
    );
    this.#logger.log(
      `${loggingPrefix} Getting API key for client. Currently its just using the Bambu key.`
    );
    await PromiseUtils.threadSleep(1500);
    this.#logger.log(
      `${loggingPrefix} Acquired API key for client. Currently its just using the Bambu key.`
    );
    return {
      key: this.config.getOrThrow('masterApiKeyLibrary', { infer: true }),
    };
  }
}
