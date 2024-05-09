import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IBambuApiLibraryIntegrationConfigDto } from '@bambu/server-core/configuration';
import { ErrorUtils, JsonUtils } from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';

export abstract class BambuApiLibraryClientConfigRepositoryServiceBase {
  public abstract ShouldWeUseBambuMasterKeyForEverything(): boolean;

  public abstract GetMasterApiLibraryKey(requestId?: string): string;
}

@Injectable()
export class BambuApiLibraryClientConfigRepositoryService
  implements BambuApiLibraryClientConfigRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(
    BambuApiLibraryClientConfigRepositoryService.name
  );

  constructor(
    private readonly config: ConfigService<IBambuApiLibraryIntegrationConfigDto>
  ) {}

  public ShouldWeUseBambuMasterKeyForEverything(): boolean {
    return this.config.get('useBambuMasterLicense', { infer: true }) === true;
  }

  public GetMasterApiLibraryKey(requestId?: string): string {
    const masterKey = this.config.get('masterApiKeyLibrary', { infer: true });
    if (masterKey !== undefined && masterKey !== null) {
      return masterKey;
    }
    const error = new ErrorUtils.ColossusError(
      'API Library Master Key missing.',
      !requestId ? 'N/A' : requestId,
      {},
      500,
      SharedEnums.ErrorCodes.GenericErrorCodesEnum.UNHANDLED
    );

    this.#logger.log(`${JsonUtils.Stringify(error)}`);

    throw error;
  }
}
