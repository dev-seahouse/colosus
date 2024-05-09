import { IColossusTrackingDto } from '@bambu/server-core/dto';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import { TenantRequest, TenantResponse } from '@fusionauth/typescript-client';
import { Injectable, Logger } from '@nestjs/common';
import { BaseFusionAuthIamRepositoryService } from './base-fusion-auth-iam-repository.service';

export abstract class FusionAuthIamTenantRepositoryServiceBase extends BaseFusionAuthIamRepositoryService {
  public abstract Create(
    input: IFusionAuthCreateTenantRequestDto
  ): Promise<TenantResponse>;

  public abstract GetTenantDefaultConfiguration(
    requestId: string,
    tenantName: string,
    verificationEmailTemplateId?: string
  ): Promise<TenantRequest>;
}

export interface IFusionAuthCreateTenantRequestDto {
  tenantName: string;
  tenantId: string;
  tenantCreationPayload: TenantRequest;
  tracking: IColossusTrackingDto;
}

@Injectable()
export class FusionAuthIamTenantRepositoryService extends FusionAuthIamTenantRepositoryServiceBase {
  readonly #logger: Logger = new Logger(
    FusionAuthIamTenantRepositoryService.name
  );

  public async GetTenantDefaultConfiguration(
    requestId: string,
    tenantName: string,
    verificationEmailTemplateId?: string
  ): Promise<TenantRequest> {
    if (
      verificationEmailTemplateId === undefined ||
      verificationEmailTemplateId === null
    ) {
      const defaultEmailTemplateName =
        '[FusionAuth Default] Email Verification';

      const emailTemplateSearchResult = await super.searchEmailTemplatesAsAdmin(
        {
          requestId,
          name: defaultEmailTemplateName,
        }
      );

      if (
        emailTemplateSearchResult.total !== 1 ||
        !emailTemplateSearchResult.emailTemplates ||
        emailTemplateSearchResult.emailTemplates.length !== 1
      ) {
        throw new ErrorUtils.ColossusError(
          `Expected 1 IAM verification email template, found ${emailTemplateSearchResult.total}.`,
          requestId,
          {
            tenantName,
            defaultEmailTemplateName,
          },
          500,
          SharedEnums.ErrorCodes.GenericErrorCodesEnum.UNHANDLED_IAM_SERVICE_ERROR
        );
      }

      verificationEmailTemplateId =
        emailTemplateSearchResult.emailTemplates[0].id;
    }

    const {
      rememberPreviousPasswords,
      jwtTokenTtlInSeconds,
      jwtRefreshTokenTtlInMinutes,
    } = super.fusionAuthConfig;

    return {
      tenant: {
        jwtConfiguration: {
          // refreshTokenUsagePolicy: RefreshTokenUsagePolicy.OneTimeUse,
          enabled: true,
          timeToLiveInSeconds: jwtTokenTtlInSeconds,
          refreshTokenTimeToLiveInMinutes: jwtRefreshTokenTtlInMinutes,
        },
        name: tenantName,
        passwordValidationRules: {
          rememberPreviousPasswords: {
            ...rememberPreviousPasswords,
          },
          requireMixedCase: false,
          requireNonAlpha: false,
          requireNumber: false,
          validateOnLogin: false,
        },
        userDeletePolicy: {
          unverified: {
            enabled: false,
            numberOfDaysToRetain: 120,
          },
        },
        loginConfiguration: {
          // False to allow login without applicationId
          requireAuthentication: false,
        },
        emailConfiguration: {
          // Create User Unverified - Start
          implicitEmailVerificationAllowed: false,
          verificationEmailTemplateId,
          verifyEmail: true,
          verifyEmailWhenChanged: false,
          // Create User Unverified - End
        },
        passwordEncryptionConfiguration: {
          encryptionScheme: 'salted-pbkdf2-hmac-sha512-512',
          modifyEncryptionSchemeOnLogin: true,
          encryptionSchemeFactor: 24000,
        },
      },
    };
  }

  public async Create(
    input: IFusionAuthCreateTenantRequestDto
  ): Promise<TenantResponse> {
    const { tenantId, tenantName, tenantCreationPayload, tracking } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.Create.name,
      tracking.requestId
    );
    try {
      this.#logger.verbose(`${logPrefix} Creating tenant ${tenantName}.`);
      this.#logger.debug(
        `${logPrefix} Creating tenant input: ${JsonUtils.Stringify(input)}.`
      );

      const sdkResult = await super
        .generateFusionAuthClient()
        .createTenant(tenantId, tenantCreationPayload);

      this.#logger.verbose(`${logPrefix} Created tenant ${tenantName}.`);
      this.#logger.debug(
        `${logPrefix} Created tenant: ${JsonUtils.Stringify(sdkResult)}.`
      );
      return sdkResult.response as TenantResponse;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error creating tenant: ${JsonUtils.Stringify(error)}.`
      );

      throw super.generateFusionAuthError({
        error,
        requestId: tracking.requestId,
      });
    }
  }
}
