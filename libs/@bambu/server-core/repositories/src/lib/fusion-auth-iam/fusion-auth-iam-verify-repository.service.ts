import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { LoginResponse } from '@fusionauth/typescript-client';
import { Injectable, Logger } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { BaseFusionAuthIamRepositoryService } from './base-fusion-auth-iam-repository.service';

export abstract class FusionAuthIamVerifyRepositoryServiceBase extends BaseFusionAuthIamRepositoryService {
  public abstract Verify(token: string): Promise<boolean>;
}

@Injectable()
export class FusionAuthIamVerifyRepositoryService extends FusionAuthIamVerifyRepositoryServiceBase {
  private readonly logger: Logger = new Logger(
    FusionAuthIamVerifyRepositoryService.name
  );

  // no requestId available at time of guarding against tokens
  public async Verify(token: string): Promise<boolean> {
    const logPrefix = LoggingUtils.generateLogPrefix(this.Verify.name, '');
    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };

      const url = new URL(
        '/oauth2/userinfo',
        super.fusionAuthConfig.baseUrl
      ).toString();
      this.logger.debug(
        `${logPrefix} - Payload: ${JsonUtils.Stringify({
          url,
          headers,
        })}.`
      );
      const source = super.httpService.post<LoginResponse>(url, undefined, {
        headers,
      });
      const response = await firstValueFrom(source);

      this.logger.debug(
        `${logPrefix} - Response: ${JsonUtils.Stringify(response)}.`
      );

      return response.status === 200;
    } catch (error) {
      if (isAxiosError(error)) {
        // If the error is an AxiosError, then status code is 4XX or 5XX.
        if (
          error.isAxiosError &&
          error.response?.status &&
          error.response.status < 500
        ) {
          return false;
        }
      }
      this.logger.error(`${logPrefix} - Error: ${JsonUtils.Stringify(error)}.`);

      throw error;
    }
  }
}
