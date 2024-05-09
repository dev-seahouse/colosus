import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import {
  GroupMember,
  RegistrationRequest,
  RegistrationResponse,
  User,
  UserRequest,
  UserResponse,
} from '@fusionauth/typescript-client';
import { Injectable, Logger } from '@nestjs/common';
import { BaseFusionAuthIamRepositoryService } from './base-fusion-auth-iam-repository.service';

export interface IFusionAuthCreateUserParamsDto {
  userId: string;
  username: string;
  email: string;
  password: string;
  mobilePhone?: string;
  groupMemberships?: string[];
  additionalMetadata?: Record<string, unknown>;
}

export interface IFusionAuthCreateUserAndRegisterToApplicationParamsDto {
  user: IFusionAuthCreateUserParamsDto;
  tenantId: string;
  applicationId: string;
  applicationPreferredLanguages?: string[];
}

export interface IFusionAuthChangePasswordParamsDto {
  tenantId: string;
  loginId: string;
  password: string;
  // Not used now, potentially for later use
  currentPassword?: string;
}

export interface IFusionAuthUpdateUserByIdParamsDto {
  tenantId: string;
  userId: string;
  payload: UserRequest;
}

export abstract class FusionAuthIamUserRepositoryServiceBase extends BaseFusionAuthIamRepositoryService {
  public abstract CreateUserAndRegisterToApplication(
    requestId: string,
    input: IFusionAuthCreateUserAndRegisterToApplicationParamsDto
  ): Promise<RegistrationResponse>;

  public abstract GetTenantUserById(
    requestId: string,
    userId: string,
    tenantId: string
  ): Promise<UserResponse>;

  public abstract FindUserByLoginId(
    requestId: string,
    loginId: string,
    tenantId?: string
  ): Promise<User | null>;

  /**
   * Verifies a user administratively.
   * This bypasses the FusionAuth email verification process.
   * @param requestId {string} The request id created by colossus.
   * @param userId {string} The user id to verify.
   * @constructor
   */
  public abstract AdministrativelyVerifyUser(
    requestId: string,
    userId: string
  ): Promise<void>;

  public abstract AdministrativelyChangeUserPassword(
    requestId: string,
    input: IFusionAuthChangePasswordParamsDto
  ): Promise<void>;

  public abstract UpdateUserById(
    requestId: string,
    input: IFusionAuthUpdateUserByIdParamsDto
  ): Promise<UserResponse>;
}

@Injectable()
export class FusionAuthIamUserRepositoryService extends FusionAuthIamUserRepositoryServiceBase {
  readonly #logger: Logger = new Logger(
    FusionAuthIamUserRepositoryService.name
  );

  public async CreateUserAndRegisterToApplication(
    requestId: string,
    input: IFusionAuthCreateUserAndRegisterToApplicationParamsDto
  ) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateUserAndRegisterToApplication.name,
      requestId
    );
    try {
      const {
        tenantId,
        applicationPreferredLanguages,
        applicationId,
        user: {
          groupMemberships,
          additionalMetadata,
          username,
          password,
          mobilePhone,
          userId,
          email,
        },
      } = input;
      this.#logger.verbose(
        `${logPrefix} Creating user for tenant (${tenantId}) and application (${applicationId}).`
      );
      this.#logger.debug(`${logPrefix} User: ${JsonUtils.Stringify(input)}.`);
      const client = super.generateFusionAuthClient(tenantId);
      const payload: RegistrationRequest = {
        user: {
          username,
          password,
          email,
          tenantId,
          data: additionalMetadata || undefined,
          memberships: Array.isArray(groupMemberships)
            ? groupMemberships.map((x) => {
                return {
                  groupId: x,
                } as GroupMember;
              })
            : undefined,
          mobilePhone: mobilePhone || undefined,
        },
        registration: {
          applicationId,
          preferredLanguages: applicationPreferredLanguages || undefined,
        },
      };
      const sdkResponse = await client.register(userId, payload);
      this.#logger.verbose(`${logPrefix} User created successfully.`);
      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(sdkResponse)}.`
      );
      return sdkResponse.response;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error creating tenant: ${JsonUtils.Stringify(error)}.`
      );
      throw super.generateFusionAuthError({
        error,
        requestId,
      });
    }
  }

  public async GetTenantUserById(
    requestId: string,
    userId: string,
    tenantId: string
  ): Promise<UserResponse> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetTenantUserById.name,
      requestId
    );
    try {
      this.#logger.verbose(
        `${logPrefix} Getting user by id: ${userId} for tenant ${tenantId}.`
      );
      const client = super.generateFusionAuthClient(tenantId);
      const sdkResponse = await client.retrieveUser(userId);
      this.#logger.verbose(`${logPrefix} User retrieved successfully.`);
      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(sdkResponse)}.`
      );
      return sdkResponse.response;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting tenant user: ${JsonUtils.Stringify(error)}.`
      );
      throw super.generateFusionAuthError({
        error,
        requestId,
      });
    }
  }

  public async FindUserByLoginId(
    requestId: string,
    loginId: string,
    tenantId?: string
  ): Promise<User | null> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetTenantUserById.name,
      requestId
    );
    try {
      this.#logger.verbose(
        `${logPrefix} Getting user by loginId: ${loginId} for tenant ${tenantId}.`
      );

      const client = super.generateFusionAuthClient(tenantId);
      // consider testing .replace as '+ - = && || > < ! ( ) { } [ ] ^ " ~ * ? : \ /'.replace(...).replace(...)
      const escapedLoginId = loginId
        .replace(
          // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax
          // we don't use [...] syntax due to replacing && with \&& and || with \||
          /(\+|-|=|&&|\|\||!|\(|\)|{|}|\[|\]|\^|"|~|\*|\?|:|\/)/g,
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
          '\\$&'
        )
        .replace(/(<>)/g, '');
      // https://fusionauth.io/docs/v1/tech/guides/user-search-with-elasticsearch#searching-with-querystring
      const sdkResponse = await client.searchUsersByQuery({
        search: {
          numberOfResults: 1,
          queryString: `email:"${escapedLoginId}" OR username:"${escapedLoginId}"`,
          orderBy: 'insertInstant DESC',
        },
      });

      this.#logger.verbose(`${logPrefix} User retrieved successfully.`);
      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(sdkResponse)}.`
      );

      const { users } = sdkResponse.response;

      if (!users || users.length === 0) {
        return null;
      }

      return users[0];
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting tenant user: ${JsonUtils.Stringify(error)}.`
      );
      throw super.generateFusionAuthError({
        error,
        requestId,
      });
    }
  }

  public async UpdateUserById(
    requestId: string,
    input: IFusionAuthUpdateUserByIdParamsDto
  ): Promise<UserResponse> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.UpdateUserById.name,
      requestId
    );
    this.#logger.verbose(`${logPrefix} Updating user by id (${input.userId}).`);
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);
    try {
      const { tenantId, userId, payload } = input;
      const client = super.generateFusionAuthClient(tenantId);
      const sdkResponse = await client.patchUser(userId, payload);
      return sdkResponse.response;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error updating user: ${JsonUtils.Stringify(error)}.`
      );
      throw super.generateFusionAuthError({
        error,
        requestId,
      });
    }
  }

  /**
   * Verifies a user('s email) administratively.
   * This bypasses the FusionAuth email verification process.
   * @param requestId {string} The request id created by colossus.
   * @param userId {string} The user id to verify.
   * @constructor
   */
  public async AdministrativelyVerifyUser(
    requestId: string,
    userId: string
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.AdministrativelyVerifyUser.name,
      requestId
    );
    try {
      this.#logger.verbose(
        `${logPrefix} Verifying user administratively: ${userId}.`
      );
      const client = super.generateFusionAuthClient();
      const sdkResponse = await client.verifyEmailAddressByUserId({
        userId,
      });
      this.#logger.verbose(`${logPrefix} User verified successfully.`);
      this.#logger.debug(
        `${logPrefix} Response: ${JsonUtils.Stringify(sdkResponse)}.`
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error verifying user: ${JsonUtils.Stringify(error)}.`
      );
      throw super.generateFusionAuthError({
        error,
        requestId,
      });
    }
  }

  public async AdministrativelyChangeUserPassword(
    requestId: string,
    input: IFusionAuthChangePasswordParamsDto
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AdministrativelyChangeUserPassword.name,
      requestId
    );
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);
    try {
      const { loginId, password, tenantId } = input;

      const client = super.generateFusionAuthClient(tenantId);

      await client.changePasswordByIdentity({
        loginId,
        password,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error changing user password: ${JsonUtils.Stringify(
          error
        )}.`
      );
      throw super.generateFusionAuthError({
        error,
        requestId,
      });
    }
  }
}
