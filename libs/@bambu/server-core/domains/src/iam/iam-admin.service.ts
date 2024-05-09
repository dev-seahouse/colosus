import {
  FusionAuthIamUserRepositoryServiceBase,
  IamAdminRepositoryServiceBase,
  IFusionAuthChangePasswordParamsDto,
  TenantCentralDbRepositoryService,
} from '@bambu/server-core/repositories';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
  UuidUtils,
} from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import {
  IamAdminServiceBase,
  IChangePasswordByIdParams,
  IIamUserInformationDto,
  IIamAdminCreateUserDto,
} from './iam-admin.service.base';

@Injectable()
export class IamAdminService implements IamAdminServiceBase {
  readonly #logger = new Logger(IamAdminService.name);

  constructor(
    private readonly iamAdminRepository: IamAdminRepositoryServiceBase,
    private readonly tenantCentralDb: TenantCentralDbRepositoryService,
    private readonly fusionAuthIamUser: FusionAuthIamUserRepositoryServiceBase
  ) {}

  async SetUserPersonalNames(
    requestId: string,
    {
      firstName,
      lastName,
      userId,
      realmId,
    }: {
      realmId: string;
      userId: string;
      firstName: string;
      lastName: string;
    }
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.VerifyUserEmailById.name,
      requestId
    );
    try {
      const tenant = await this.getColossusTenant(realmId);

      if (tenant.linkedToFusionAuth) {
        await this.fusionAuthIamUser.UpdateUserById(requestId, {
          userId,
          tenantId: tenant.id,
          payload: {
            user: {
              firstName,
              lastName,
            },
          },
        });
        return;
      }

      if (tenant.linkedToKeyCloak) {
        const targetRealmId: string = tenant.usesIdInsteadOfRealm
          ? tenant.id
          : tenant.realm;

        await this.iamAdminRepository.SetUserPersonalNames({
          realmId: targetRealmId,
          userId,
          firstName,
          lastName,
        });
        return;
      }

      // noinspection ExceptionCaughtLocallyJS
      throw new ErrorUtils.ColossusError(
        `User realm is not linked to IAM.`,
        requestId,
        {
          firstName,
          lastName,
          userId,
          realmId,
        }
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error giving names to the user: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  GetRealmUsers(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  CreateInvestor(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async VerifyUserEmailById(
    requestId: string,
    realmId: string,
    userId: string
  ): Promise<void> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.VerifyUserEmailById.name,
      requestId
    );

    try {
      const tenant = await this.getColossusTenant(realmId);

      if (tenant.linkedToKeyCloak) {
        return await this.iamAdminRepository.VerifyUserEmailById(
          realmId,
          userId
        );
      }

      await this.fusionAuthIamUser.AdministrativelyVerifyUser(
        requestId,
        userId
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error enabling user: ${JsonUtils.Stringify(error)}.`
      );
      throw error;
    }
  }

  async ChangePasswordById(params: IChangePasswordByIdParams): Promise<void> {
    const {
      tracking: { requestId },
      realmId,
      username,
      newPassword,
    } = params;

    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.ChangePasswordById.name,
      requestId
    );

    try {
      const tenant = await this.getColossusTenant(realmId);

      if (tenant.linkedToKeyCloak) {
        await this.iamAdminRepository.ChangePasswordById(params);
        return;
      }

      await this.changePasswordByIdViaFusionAuth(requestId, {
        loginId: username,
        password: newPassword,
        tenantId: tenant.id,
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error enabling user: ${error}, ${params.tracking}`
      );
      throw error;
    }
  }

  private async changePasswordByIdViaFusionAuth(
    requestId: string,
    params: IFusionAuthChangePasswordParamsDto
  ) {
    await this.fusionAuthIamUser.AdministrativelyChangeUserPassword(
      requestId,
      params
    );
  }

  async GetRealmUser(
    realmId: string,
    userId: string
  ): Promise<IIamUserInformationDto> {
    const logPrefix = `${this.GetRealmUser.name} -`;
    try {
      return await this.iamAdminRepository.GetRealmUser(realmId, userId);
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting realm user by id: ${error}`
      );
      throw error;
    }
  }

  async GetRealmUserByUsername(
    requestId: string,
    realmId: string,
    username: string
  ): Promise<IIamUserInformationDto> {
    const logPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetRealmUserByUsername.name,
      requestId
    );

    try {
      const tenant = await this.getColossusTenant(realmId);
      if (!tenant) {
        throw ErrorUtils.getDefaultMissingTenantInDbError({
          requestId,
          errorMessage: `Tenant not found for tenant realmId (${realmId}).`,
        });
      }

      if (tenant.linkedToKeyCloak) {
        return await this.iamAdminRepository.GetRealmUserByUsername(
          requestId,
          realmId,
          username
        );
      }

      return this.getFusionAuthRealmUserById(requestId, tenant.id, username);
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting realm by initial user's username: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  private async getColossusTenant(realmId: string) {
    /**
     * Workaround.
     *
     * We are moving towards using UUIDs for tenant realms, but we still have some legacy code that uses tenant names.
     */
    return UuidUtils.isStringUuid(realmId)
      ? await this.tenantCentralDb.FindTenantById(realmId)
      : await this.tenantCentralDb.FindTenantByRealm(realmId);
  }

  private async getFusionAuthRealmUserById(
    requestId: string,
    tenantId: string,
    userName: string
  ): Promise<IIamUserInformationDto> {
    const user = await this.fusionAuthIamUser.FindUserByLoginId(
      requestId,
      userName,
      tenantId
    );

    if (!user) {
      throw new ErrorUtils.ColossusError(
        `User not found: ${userName}.`,
        requestId,
        {
          tenantId,
          userName,
        },
        404,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.TENANT_USER_NOT_FOUND
      );
    }

    return {
      id: user.id,
      email: user.email,
      enabled: user.active,
      firstName: user?.firstName,
      lastName: user?.lastName,
      username: user.username,
      emailVerified: user.verified,
    } as IIamUserInformationDto;
  }

  async SetPersonalNamesForUserById(
    realmId: string,
    userId: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    const logPrefix = `${this.SetPersonalNamesForUserById.name} -`;
    try {
      await this.iamAdminRepository.SetUserPersonalNames({
        realmId,
        userId,
        firstName,
        lastName,
      });
      return;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error getting realm by initial user's username: ${error}`
      );
      throw error;
    }
  }

  async CreateTenantRealmWithInitialUser(
    realmId: string,
    initialUser: Omit<IIamAdminCreateUserDto, 'groups'>
  ): Promise<void> {
    const logPrefix = `${this.CreateTenantRealmWithInitialUser.name} -`;
    try {
      await this.iamAdminRepository.CreateTenantRealm(realmId);
      await this.iamAdminRepository.CreateUser(realmId, {
        ...initialUser,
        // TODO: make this enums or dto
        groups: ['Vendee-Admin', 'Advisor'],
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error creating tenant realm with initial user: ${error}`
      );
      throw error;
    }
  }
}
