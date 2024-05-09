import { Injectable, Logger } from '@nestjs/common';
import { FusionAuthAuthorizationServiceBase } from './fusion-auth-authorization.service.base';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { isAxiosError } from 'axios';
import { FusionAuthIamVerifyRepositoryServiceBase } from '@bambu/server-core/repositories';

@Injectable()
export class FusionAuthAuthorizationService
  implements FusionAuthAuthorizationServiceBase
{
  constructor(
    private readonly fusionAuthVerify: FusionAuthIamVerifyRepositoryServiceBase
  ) {}
  private readonly logger: Logger = new Logger(
    FusionAuthAuthorizationService.name
  );

  public async Verify(token: string): Promise<boolean> {
    const logPrefix = LoggingUtils.generateLogPrefix(this.Verify.name);
    this.logger.debug(
      `${logPrefix} - ${JSON.stringify(this.fusionAuthVerify)}.`
    );
    try {
      return await this.fusionAuthVerify.Verify(token);
    } catch (error) {
      this.logger.error(`${logPrefix} - Error: ${JsonUtils.Stringify(error)}.`);

      if (isAxiosError(error)) {
        if (error.isAxiosError && error.response?.status === 404) {
          // no request id available at time of guarding against tokens
          throw ErrorUtils.getDefaultInvalidCredentialsError('', {
            error,
          });
        }
      }

      throw error;
    }
  }
}
