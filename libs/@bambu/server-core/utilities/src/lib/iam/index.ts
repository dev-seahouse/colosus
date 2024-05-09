import { IServerCoreIamClaimsDto } from '@bambu/server-core/dto';
import { Logger } from '@nestjs/common';
import * as JoseUtils from '../jose';

import { Stringify as JsonStringify } from '../json-utils';

export class IamRealmUtilityProcessingError extends Error {
  constructor(message: string) {
    super(message);

    // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
    Object.setPrototypeOf(this, IamRealmUtilityProcessingError.prototype);
  }
}

export function GetRealmSansUrl(
  issuer: string,
  baseUrl: string,
  logger: Logger = new Logger('GetRealmSansUrl')
): string {
  const inputParameters = { issuer, baseUrl };

  try {
    const basePath = `${baseUrl}/realms/`;

    if (!issuer.startsWith(basePath)) {
      const invalidIssErrorMessage = [
        `Invalid refresh token.`,
        `Issuer ${issuer} does not match the configured baseUrl ${basePath}.`,
      ].join(' ');

      logger.error(invalidIssErrorMessage);

      throw new IamRealmUtilityProcessingError(invalidIssErrorMessage);
    }

    const realmId = issuer.slice(basePath.length);

    logger.debug(
      [
        `Realm ID acquired.`,
        `Realm ID is ${realmId}.`,
        `The realm URL us ${issuer}.`,
        `Configured realm base URL is ${basePath}`,
      ].join(' ')
    );

    return realmId;
  } catch (error) {
    const errorMessage = [
      'Error while acquiring realm name from realm URL.',
      'This is not necesarily an error especially if the issuer comes from an external IAM (e.g. Fusion Auth when we are looking up Keycloak).',
      `Parameters: ${JsonStringify(inputParameters)}.`,
      `Error details: ${JsonStringify(error)}.`,
    ].join(' ');
    logger.warn(errorMessage);

    throw new IamRealmUtilityProcessingError(errorMessage);
  }
}

export function GetIssuerFromJwtToken(
  token: string,
  logger = new Logger('GetIssuerFromJwtToken')
): string {
  const snarkyMessage = `In case it wasn't obvious, don't include the brackets when getting the token.`;
  try {
    const { iss } = JoseUtils.parseArbitraryJWT(token);

    if (!iss) {
      const invalidTokenErrorMessage =
        'Invalid refresh token. No issuer found.';
      logger.error(
        [
          invalidTokenErrorMessage,
          `Token provided: (${token})`,
          snarkyMessage,
        ].join(' ')
      );
      throw new IamRealmUtilityProcessingError(invalidTokenErrorMessage);
    }

    return iss;
  } catch (error) {
    const errorMessage = [
      'Error while extracting iss/issuer from JWT token.',
      `Token input value is (${token}).`,
      snarkyMessage,
      `Error details: ${JsonStringify(error)}.`,
    ].join(' ');

    logger.error(errorMessage);

    throw new IamRealmUtilityProcessingError(errorMessage);
  }
}

export function getFusionAuthRealmFromClaims(
  claims: IServerCoreIamClaimsDto
): string {
  return claims?.tid;
}
