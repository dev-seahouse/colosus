import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import {
  Group,
  GroupRequest,
  GroupResponse,
} from '@fusionauth/typescript-client';
import { Injectable, Logger } from '@nestjs/common';
import { BaseFusionAuthIamRepositoryService } from './base-fusion-auth-iam-repository.service';
import { IColossusTrackingDto } from '@bambu/server-core/dto';

export interface IFusionAuthCreateGroupParamsDto {
  groupId: string;
  name: string;
  roleIds: string[];
  tenantId: string;
  additionalMetadata?: Record<string, unknown>;
  tracking: IColossusTrackingDto;
}

export interface IFusionAuthGetGroupsForTenantByApplicationIdAndRoleNameParamsDto {
  tenantId: string;
  applicationId: string;
  roleName: string;
  tracking: IColossusTrackingDto;
}

export abstract class FusionAuthIamGroupRepositoryServiceBase extends BaseFusionAuthIamRepositoryService {
  public abstract CreateGroup(
    input: IFusionAuthCreateGroupParamsDto
  ): Promise<GroupResponse>;

  public abstract AdministrativelyGetGroupsForTenantByApplicationIdAndRoleName(
    input: IFusionAuthGetGroupsForTenantByApplicationIdAndRoleNameParamsDto
  ): Promise<Group[]>;
}

@Injectable()
export class FusionAuthIamGroupRepositoryService extends FusionAuthIamGroupRepositoryServiceBase {
  readonly #logger = new Logger(FusionAuthIamGroupRepositoryService.name);

  public async CreateGroup(
    input: IFusionAuthCreateGroupParamsDto
  ): Promise<GroupResponse> {
    const { tenantId, roleIds, name, groupId, tracking } = input;
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateGroup.name,
      tracking.requestId
    );
    try {
      this.#logger.verbose(`${logPrefix} Creating group (${name})...`);
      this.#logger.debug(
        `${logPrefix} Group creation parameters: ${JsonUtils.Stringify(input)}.`
      );

      const client = super.generateFusionAuthClient(tenantId);
      const apiPayload: GroupRequest = {
        group: {
          name,
          tenantId,
        },
        roleIds,
      };
      const sdkResult = await client.createGroup(groupId, apiPayload);

      this.#logger.verbose(`${logPrefix} Group created successfully.`);
      this.#logger.debug(
        `${logPrefix} Group creation result: ${JsonUtils.Stringify(sdkResult)}.`
      );

      return sdkResult.response;
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

  public async AdministrativelyGetGroupsForTenantByApplicationIdAndRoleName(
    input: IFusionAuthGetGroupsForTenantByApplicationIdAndRoleNameParamsDto
  ) {
    const { tracking, tenantId, applicationId, roleName } = input;
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AdministrativelyGetGroupsForTenantByApplicationIdAndRoleName.name,
      tracking.requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);
    try {
      const client = super.generateFusionAuthClient(tenantId);

      const sdkResponse = await client.retrieveGroups();
      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(sdkResponse)}.`
      );
      if (!sdkResponse.wasSuccessful()) {
        throw sdkResponse.exception;
      }
      const { groups } = sdkResponse.response;
      if (!groups) {
        throw new Error('"groups" key not found in sdk Response.');
      }
      const res = groups.filter(
        ({ tenantId: groupTenantId, roles }) =>
          tenantId === groupTenantId &&
          roles &&
          roles[applicationId] &&
          roles[applicationId].some(({ name }) => name === roleName)
      );
      return res;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error retrieving groups: ${JsonUtils.Stringify(error)}.`
      );
      throw super.generateFusionAuthError({
        error,
        requestId: tracking.requestId,
      });
    }
  }
}
