// noinspection ES6PreferShortImport

import {
  IDefaultServerConfig,
  IKeycloakFusionAuthSwitchoverConfigDto,
  IKeycloakIntegrationConfigDto,
} from '@bambu/server-core/configuration';
import {
  CentralDbPrismaService,
  PrismaModel,
} from '@bambu/server-core/db/central-db';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
  UuidUtils,
} from '@bambu/server-core/utilities';
import { IamDto } from '@bambu/shared';

// https://stackoverflow.com/questions/74830166/unable-to-import-esm-module-in-nestjs
// See: https://github.com/keycloak/keycloak-nodejs-admin-client/issues/523#issuecomment-1273231149 for current workaround
import { Keycloak as KcAdminClient } from '@jhanschoo/keycloak-cjs';
import type GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation.js';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IamAdminRepositoryServiceBase,
  IChangePasswordByIdParams,
} from './iam-admin-repository.service.base';

// This keycloak admin repository implementation initializes Keycloak to the state that is required for the application to work during construction, if it detects that Keycloak is likely in its initial state.
@Injectable()
export class KeycloakIamAdminRepositoryService
  implements IamAdminRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(KeycloakIamAdminRepositoryService.name);
  readonly #keycloakConfig: IKeycloakIntegrationConfigDto['keycloak'];
  readonly #kcAdminClient: Promise<KcAdminClient | null>;
  readonly #env: string;

  constructor(
    private readonly config: ConfigService<IDefaultServerConfig>,
    private readonly keycloakConfig: ConfigService<IKeycloakIntegrationConfigDto>,
    private readonly keycloakFusionAuthSwitchoverConfig: ConfigService<IKeycloakFusionAuthSwitchoverConfigDto>,
    private readonly prisma: CentralDbPrismaService
  ) {
    this.#keycloakConfig = this.keycloakConfig.get('keycloak', {
      infer: true,
    }) as IKeycloakIntegrationConfigDto['keycloak'];
    this.#env = this.config.get('env', { infer: true }) as string;

    this.#logger.debug(`The baseUrl set is ${this.#keycloakConfig.baseUrl}`);

    this.#kcAdminClient = (async () => {
      const useLegacyKeycloakForTenantCreation =
        this.keycloakFusionAuthSwitchoverConfig.getOrThrow(
          'keycloakFusionAuthSwitchover.useLegacyKeycloakForTenantCreation',
          { infer: true }
        );

      if (!useLegacyKeycloakForTenantCreation) {
        this.#logger.log(
          `constructor Not using legacy keycloak for tenant creation. Aborting setup.`
        );
        return null;
      }
      const client = await this.#initializeKeycloakAdminClient();
      await this.initializeKeycloak(client);
      return client;
    })();
  }

  async SetUserPersonalNames({
    realmId,
    userId,
    firstName,
    lastName,
  }: {
    realmId: string;
    userId: string;
    firstName: string;
    lastName: string;
  }): Promise<void> {
    const logPrefix = `${this.SetUserPersonalNames.name} -`;
    try {
      const kcAdminClient = await this.#kcAdminClient;
      if (!kcAdminClient) {
        this.#logger.warn(
          `${logPrefix} Keycloak client has not been initialized. Function aborted.`
        );
        return;
      }

      const targetRealmId: string = await this.AcquireAppropriateRealmId(
        realmId
      );

      await kcAdminClient.users.update(
        { id: userId, realm: targetRealmId },
        { firstName, lastName }
      );
      return;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async ChangePasswordById({
    realmId,
    userId,
    newPassword,
    tracking,
  }: IChangePasswordByIdParams): Promise<void> {
    const logPrefix = `${this.VerifyUserEmailById.name} -`;
    try {
      const kcAdminClient = await this.#kcAdminClient;
      if (!kcAdminClient) {
        this.#logger.warn(
          `${logPrefix} Keycloak client has not been initialized. Function aborted.`
        );
        return;
      }

      const targetRealmId: string = await this.AcquireAppropriateRealmId(
        realmId
      );

      await kcAdminClient.users.resetPassword({
        id: userId,
        realm: targetRealmId,
        credential: {
          temporary: false,
          type: 'password',
          value: newPassword,
        },
      });
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify({
          error,
          tracking,
        })}`
      );
      throw error;
    }
  }

  async VerifyUserEmailById(realmId: string, userId: string): Promise<void> {
    const logPrefix = `${this.VerifyUserEmailById.name} -`;
    try {
      const kcAdminClient = await this.#kcAdminClient;
      if (!kcAdminClient) {
        this.#logger.warn(
          `${logPrefix} Keycloak client has not been initialized. Function aborted.`
        );
        return;
      }

      const targetRealmId: string = await this.AcquireAppropriateRealmId(
        realmId
      );

      await kcAdminClient.users.update(
        { id: userId, realm: targetRealmId },
        { emailVerified: true }
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async GetRealmUser(
    realm: string,
    userId: string
  ): Promise<IamDto.IIamUserInformationDto | undefined> {
    const logPrefix = `${this.GetRealmUser.name} -`;
    try {
      this.#logger.debug(
        `${logPrefix} Getting user ${userId} in realm ${realm}`
      );

      const kcAdminClient = await this.#kcAdminClient;
      if (!kcAdminClient) {
        this.#logger.warn(
          `${logPrefix} Keycloak client has not been initialized. Function aborted.`
        );
        return;
      }

      const user = (await kcAdminClient.users.findOne({
        id: userId,
        realm,
      })) as IamDto.IIamUserInformationDto | undefined;

      if (user) {
        this.#logger.debug(
          `${logPrefix} User details: ${JsonUtils.Stringify(user)}.`
        );
      } else {
        this.#logger.debug(`${logPrefix} User details: null.`);
      }

      return user;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async GetRealmUserByUsername(
    requestId: string,
    realmId: string,
    username: string
  ): Promise<IamDto.IIamUserInformationDto | undefined> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetRealmUserByUsername.name,
      requestId
    );

    try {
      const kcAdminClient = await this.#kcAdminClient;
      if (!kcAdminClient) {
        this.#logger.warn(
          `${logPrefix} Keycloak client has not been initialized. Function aborted.`
        );
        return;
      }

      const targetRealmId = await this.AcquireAppropriateRealmId(realmId);
      const realmUsers: IamDto.IIamUserInformationDto[] = [];

      const users = await kcAdminClient.users.find({
        username,
        realm: targetRealmId,
      });
      realmUsers.push(...(users as IamDto.IIamUserInformationDto[]));

      if (realmUsers.length === 0) {
        return undefined;
      }
      if (realmUsers.length > 1) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          `Multiple users with username ${username} found in realm ${realmId}.`
        );
      }

      const ret = realmUsers[0] as IamDto.IIamUserInformationDto;

      this.#logger.debug(
        `${logPrefix} User details: ${JsonUtils.Stringify(ret)}.`
      );

      return ret;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async AcquireAppropriateRealmId(realmId: string): Promise<string> {
    const logPrefix = `${this.AcquireAppropriateRealmId.name} -`;
    try {
      const tenantRealm = await this.#getTenantRealmFromDb(realmId);
      if (!tenantRealm) {
        // noinspection ExceptionCaughtLocallyJS
        throw ErrorUtils.getDefaultMissingTenantInDbErrorWithTenantId({
          tenantId: realmId,
        });
      }
      this.#logger.debug(
        `${logPrefix} Found tenant realm ${JsonUtils.Stringify(tenantRealm)}.`
      );
      const targetRealmId: string = tenantRealm.usesIdInsteadOfRealm
        ? tenantRealm.id
        : tenantRealm.realm;
      this.#logger.debug(
        `${logPrefix} Returning realm id ${targetRealmId} for realmId ${realmId}.`
      );
      return targetRealmId;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while getting appropriate realm id. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async #getTenantRealmFromDb(
    realmId: string
  ): Promise<null | Omit<
    PrismaModel.Tenant,
    | 'apiKeys'
    | 'httpUrls'
    | 'users'
    | 'otps'
    | 'connectAdvisors'
    | 'tenantSubscriptions'
  >> {
    const logPrefix = `${this.#getTenantRealmFromDb.name} -`;

    try {
      if (UuidUtils.isStringUuid(realmId)) {
        this.#logger.debug(`${logPrefix} Acquiring tenant by id (${realmId}).`);

        const tenant = await this.prisma.tenant.findFirst({
          where: {
            id: realmId,
          },
        });

        this.#logger.debug(
          `${logPrefix} Acquired tenant by id (${realmId}). Details: ${JsonUtils.Stringify(
            tenant
          )}.`
        );

        return tenant;
      }

      this.#logger.debug(
        `${logPrefix} Acquiring tenant by realm name (${realmId}).`
      );

      const tenantRealm = await this.prisma.tenant.findFirst({
        where: {
          realm: realmId,
        },
      });

      this.#logger.debug(
        `${logPrefix} Acquired tenant by realm name (${realmId}). Details: ${JsonUtils.Stringify(
          tenantRealm
        )}.`
      );

      return tenantRealm;
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Getting tenant by realm.`,
        `Realm: ${realmId}`,
        `Details: ${JsonUtils.Stringify(error)}`,
      ].join(' ');

      this.#logger.error(errorMessage);

      throw error;
    }
  }

  async CreateUser(
    realm: string,
    { username, email, password, groups }: IamDto.IIamAdminCreateUserDto
  ): Promise<void> {
    const logPrefix = `${this.CreateUser.name} -`;
    try {
      const kcAdminClient = await this.#kcAdminClient;
      if (!kcAdminClient) {
        this.#logger.warn(
          `${logPrefix} Keycloak client has not been initialized. Function aborted.`
        );
        return;
      }

      this.#logger.debug(`${logPrefix} Creating user.`);
      await kcAdminClient.users.create({
        username,
        email,
        enabled: true,
        groups,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
        realm,
      });
      this.#logger.debug(`${logPrefix} Created user.`);
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async CreateTenantRealm(realm: string): Promise<void> {
    const logPrefix = `${this.CreateTenantRealm.name} -`;
    try {
      const kcAdminClient = await this.#kcAdminClient;
      if (!kcAdminClient) {
        this.#logger.warn(
          `${logPrefix} Keycloak client has not been initialized. Function aborted.`
        );
        return;
      }
      this.#logger.debug(`${logPrefix} Creating realm ${realm}.`);
      await kcAdminClient.realms.create({
        id: realm,
        realm,
        roles: CREATE_TENANT_REALM_ROLES,
        groups: CREATE_TENANT_REALM_GROUPS,
        enabled: true,
      });
      this.#logger.debug(`${logPrefix} Created realm ${realm}.`);

      this.#configureAccountClientForRealm(kcAdminClient, realm);
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async #initializeKeycloakAdminClient(): Promise<KcAdminClient> {
    const logPrefix = `${this.#initializeKeycloakAdminClient.name} -`;
    try {
      const kcAdminClient = new KcAdminClient({
        baseUrl: this.#keycloakConfig.baseUrl,
        realmName: 'master',
      });
      await kcAdminClient.auth({
        username: this.#keycloakConfig.adminUsername,
        password: this.#keycloakConfig.adminPassword,
        grantType: 'password',
        clientId: 'admin-cli',
      });
      // Note: this is a memory leak if the service isn't a singleton.
      setInterval(
        () =>
          kcAdminClient.auth({
            username: this.#keycloakConfig.adminUsername,
            password: this.#keycloakConfig.adminPassword,
            grantType: 'password',
            clientId: 'admin-cli',
          }),
        30 * 1000
      ); // Refresh the token every 30 seconds, it expires in 1 min.

      return kcAdminClient;
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  // Note: the burden of ensuring that keycloak is initialized to a state that conforms to normal operation lies in the repository service, not the domain service.
  private async initializeKeycloak(
    kcAdminClient: KcAdminClient
  ): Promise<void> {
    const logPrefix = `${this.initializeKeycloak.name} -`;
    try {
      const useLegacyKeycloakForTenantCreation =
        this.keycloakFusionAuthSwitchoverConfig.getOrThrow(
          'keycloakFusionAuthSwitchover.useLegacyKeycloakForTenantCreation',
          { infer: true }
        );

      if (!useLegacyKeycloakForTenantCreation) {
        this.#logger.log(
          `${logPrefix} Not using legacy keycloak for tenant creation. Aborting setup.`
        );
        return;
      }

      const matchingRealm = await kcAdminClient.realms.findOne({
        realm: this.#keycloakConfig.publicRealm,
      });

      if (matchingRealm) {
        this.#logger.log(`${logPrefix} Realm already exists. Aborting setup.`);
        return;
      }

      this.#logger.log(`${logPrefix} Realm does not exist. Setting up.`);

      // If this is not the development environment, throw an error.
      if (this.#env !== 'development') {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          'Keycloak is not initialized and we are not in the development environment.'
        );
      }

      // Create the public realm, with some initialization that can be done declaratively.
      await kcAdminClient.realms.create({
        id: this.#keycloakConfig.publicRealm,
        realm: this.#keycloakConfig.publicRealm,
        roles: {
          realm: [
            {
              name: 'Guest',
              description:
                'This is the role granting permissions to users that have not identified themselves. This role should not be assigned to specific users, but rather to groups.',
            },
          ],
        },
        groups: [
          {
            name: 'Guest',
            realmRoles: ['Guest'],
          },
        ],
        enabled: true,
        users: [
          {
            username: this.#keycloakConfig.publicUserUsername,
            createdTimestamp: 0, // Dummy timestamp
            enabled: true,
            groups: ['Guest'],
            credentials: [
              {
                type: 'password',
                value: this.#keycloakConfig.publicUserPassword,
                temporary: false,
              },
            ],
            // note: the publicuser is 'imported' with the composite default role not assigned, and hence it has no permissions in keycloak to do anything at all other than to authenticate
          },
        ],
      });
      // Continue with initialization, which can only be done imperatively.
      this.#configureAccountClientForRealm(
        kcAdminClient,
        this.#keycloakConfig.publicRealm
      );
    } catch (error) {
      this.#logger.error(
        `${logPrefix} Error while calling API. Details: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  async #configureAccountClientForRealm(
    kcAdminClient: KcAdminClient,
    realm: string
  ): Promise<void> {
    const logPrefix = `${this.#configureAccountClientForRealm.name} -`;

    this.#logger.debug(
      `${logPrefix} Configuring account client for realm ${realm}.`
    );

    // Step 1: Enable direct access grants for the account client.
    this.#logger.debug(`${logPrefix} Finding accountClient for ${realm}.`);
    const accountClient = (
      await kcAdminClient.clients.find({
        clientId: 'account',
        realm,
      })
    )[0];
    this.#logger.debug(`${logPrefix} Found accountClient for ${realm}.`);

    // Step 2: Map the realm roles and groups to access tokens in the account client.
    this.#logger.debug(`${logPrefix} Updating accountClient for ${realm}.`);
    await kcAdminClient.clients.update(
      {
        id: accountClient.id as string,
        realm,
      },
      ACCOUNT_CLIENT_UPDATE_PAYLOAD
    );
    this.#logger.debug(`${logPrefix} Updated accountClient for ${realm}.`);
  }
}

const CREATE_TENANT_REALM_ROLES = {
  realm: [
    {
      name: 'Advisor',
      description:
        'This is the role granting permissions to advisors. This role should not be assigned to specific users, but rather to groups.',
    },
    {
      name: 'Investor',
      description:
        'This is the role granting permissions to investors. This role should not be assigned to specific users, but rather to groups.',
    },
    {
      name: 'Vendee-Admin',
      description:
        "This is the role granting permissions to users that the platform's procurers have designated to administer their usage of the platform. This role should not be assigned to specific users, but rather to groups.",
    },
    {
      name: 'Vendor-Admin',
      description:
        'This is the role granting permissions to users that the vendor have designated to administer the platform. This role should not be assigned to specific users, but rather to groups.',
    },
    {
      name: 'Guest',
      description:
        'This is the role granting permissions to users that have not identified themselves. This role should not be assigned to specific users, but rather to groups.',
    },
  ],
};

const CREATE_TENANT_REALM_GROUPS: GroupRepresentation[] =
  CREATE_TENANT_REALM_ROLES.realm.map(({ name }) => ({
    name,
    realmRoles: [name],
  }));

CREATE_TENANT_REALM_GROUPS.push({ name: 'Default Advisor Group' });

const CREATE_TENANT_REALM_ADMIN_CLIENT_ROLES = {
  account: [
    'delete-account',
    'manage-account',
    'manage-account-links',
    'manage-consent',
    'view-applications',
    'view-consent',
    'view-groups',
    'view-profile',
  ],
  'realm-management': [
    'create-client',
    'impersonation',
    'manage-authorization',
    'manage-clients',
    'manage-events',
    'manage-identity-providers',
    'manage-realm',
    'manage-users',
    'query-clients',
    'query-groups',
    'query-realms',
    'query-users',
    'realm-admin',
    'view-authorization',
    'view-clients',
    'view-events',
    'view-identity-providers',
    'view-realm',
    'view-users',
  ],
};

const CREATE_TENANT_REALM_ADVISOR_CLIENT_ROLES = {
  account: [
    'manage-account',
    'manage-account-links',
    'manage-consent',
    'view-applications',
    'view-consent',
    'view-groups',
    'view-profile',
  ],
  'realm-management': [
    'impersonation',
    'manage-users',
    'query-groups',
    'query-users',
    'view-users',
  ],
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
CREATE_TENANT_REALM_GROUPS.find(
  ({ name }) => name === 'Vendee-Admin'
)!.clientRoles = CREATE_TENANT_REALM_ADMIN_CLIENT_ROLES;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
CREATE_TENANT_REALM_GROUPS.find(
  ({ name }) => name === 'Vendor-Admin'
)!.clientRoles = CREATE_TENANT_REALM_ADMIN_CLIENT_ROLES;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
CREATE_TENANT_REALM_GROUPS.find(({ name }) => name === 'Advisor')!.clientRoles =
  CREATE_TENANT_REALM_ADVISOR_CLIENT_ROLES;

const ACCOUNT_CLIENT_UPDATE_PAYLOAD = {
  directAccessGrantsEnabled: true,
  fullScopeAllowed: true,
  protocolMappers: [
    {
      name: 'realm roles',
      protocol: 'openid-connect',
      protocolMapper: 'oidc-usermodel-realm-role-mapper',
      config: {
        multivalued: 'true',
        'claim.name': 'realm_access.roles',
        'access.token.claim': 'true',
        'jsonType.label': 'String',
      },
    },
    {
      name: 'groups',
      protocol: 'openid-connect',
      protocolMapper: 'oidc-usermodel-realm-role-mapper',
      config: {
        multivalued: 'true',
        'claim.name': 'groups',
        'access.token.claim': 'true',
        'jsonType.label': 'String',
      },
    },
  ],
};
