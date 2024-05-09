import { IColossusTrackingDto } from '@bambu/server-core/dto';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { IamDto } from '@bambu/shared';
import {
  Application,
  ApplicationRequest,
  ApplicationResponse,
} from '@fusionauth/typescript-client';
import { Injectable, Logger } from '@nestjs/common';
import { BaseFusionAuthIamRepositoryService } from './base-fusion-auth-iam-repository.service';

export interface IFusionAuthCreateApplicationRequestDto {
  tenantId: string;
  applicationId: string;
  applicationName: string;
  creationPayload?: ApplicationRequest;
  tracking: IColossusTrackingDto;
}

export interface IFusionAuthGetApplicationsParamsDto {
  tenantId: string;
  tracking: IColossusTrackingDto;
}

export abstract class FusionAuthIamApplicationRepositoryServiceBase extends BaseFusionAuthIamRepositoryService {
  /**
   * @param applicationName
   * @param tenantId
   * @param roles Note that if this is not provided, the default roles will be used.
   */
  public abstract GetTenantApplicationDefaultConfiguration(
    applicationName: string,
    tenantId: string,
    roles?: IamDto.IIamRoleDto[]
  ): ApplicationRequest;

  /**
   * @param input Note that the `creationPayload` is optional. If not provided, the default configuration will be used.
   */
  public abstract Create(
    input: IFusionAuthCreateApplicationRequestDto
  ): Promise<ApplicationResponse>;

  public abstract GetApplications(
    input: IFusionAuthGetApplicationsParamsDto
  ): Promise<Application[]>;
}

@Injectable()
export class FusionAuthIamApplicationRepositoryService extends FusionAuthIamApplicationRepositoryServiceBase {
  readonly #logger: Logger = new Logger(
    FusionAuthIamApplicationRepositoryService.name
  );

  public GetTenantApplicationDefaultConfiguration(
    applicationName: string,
    tenantId: string,
    roles?: IamDto.IIamRoleDto[]
  ): ApplicationRequest {
    const applicationRequest: ApplicationRequest = {
      application: {
        data: {},
        // Consolidate into the tenant config
        // jwtConfiguration: {
        //   enabled: true,
        //   timeToLiveInSeconds: super.fusionAuthConfig.jwtTokenTtlInSeconds,
        //   refreshTokenTimeToLiveInMinutes: super.fusionAuthConfig
        //     .jwtRefreshTokenTtlInMinutes,
        // },
        loginConfiguration: {
          allowTokenRefresh: true,
          generateRefreshTokens: true,
          requireAuthentication: false,
        },
        name: applicationName,
        registrationDeletePolicy: {
          unverified: {
            enabled: false,
            numberOfDaysToRetain: 120,
          },
        },
        roles: [],
        tenantId,
      },
    };

    if (!Array.isArray(roles)) {
      IamDto.DEFAULT_ROLES.forEach((role) => {
        applicationRequest?.application?.roles?.push({
          ...role,
        });
      });
    }

    return applicationRequest;
  }

  public async GetApplications(
    input: IFusionAuthGetApplicationsParamsDto
  ): Promise<Application[]> {
    const { tracking, tenantId } = input;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetApplications.name,
      tracking.requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);
    try {
      const client = super.generateFusionAuthClient(tenantId);

      const sdkResponse = await client.retrieveApplications();
      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(sdkResponse)}.`
      );
      if (!sdkResponse.wasSuccessful()) {
        throw sdkResponse.exception;
      }
      const { applications } = sdkResponse.response;
      if (!applications) {
        throw new Error('"applications" key not found in sdk Response.');
      }

      // This should not be necessary due to the way the sdk client was initialized, but we do it for defensiveness.
      const res = applications.filter(
        ({ tenantId: applicationTenantId }) => tenantId === applicationTenantId
      );
      return res;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error retrieving applications: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw super.generateFusionAuthError({
        error,
        requestId: tracking.requestId,
      });
    }
  }

  public async Create(
    input: IFusionAuthCreateApplicationRequestDto
  ): Promise<ApplicationResponse> {
    const {
      applicationName,
      tenantId,
      applicationId,
      creationPayload,
      tracking,
    } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.Create.name,
      tracking.requestId
    );
    try {
      this.#logger.verbose(
        `${logPrefix} Creating application (${applicationName}).`
      );
      this.#logger.debug(
        `${logPrefix} Creating application: ${JsonUtils.Stringify(input)}.`
      );
      const requestPayload =
        creationPayload ||
        this.GetTenantApplicationDefaultConfiguration(
          applicationName,
          tenantId
        );

      const fusionAuthClient = super.generateFusionAuthClient(tenantId);
      const sdkResult = await fusionAuthClient.createApplication(
        applicationId,
        requestPayload
      );

      this.#logger.verbose(
        `${logPrefix} Application (${applicationName}) created.`
      );
      this.#logger.debug(
        `${logPrefix} Application created: ${JsonUtils.Stringify(sdkResult)}.`
      );

      return sdkResult.response as ApplicationResponse;
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
