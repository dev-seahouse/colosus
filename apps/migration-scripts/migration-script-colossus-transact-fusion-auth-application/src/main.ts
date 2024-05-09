import { JsonUtils } from '@bambu/server-core/utilities';
import { IamDto } from '@bambu/shared';
import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';
import FusionAuthClient, {
  ApplicationRequest,
  Tenant,
} from '@fusionauth/typescript-client';
import { Logger } from '@nestjs/common';
import * as crypto from 'crypto';

const logger = new Logger(
  'migration-script-colossus-transact-fusion-auth-application'
);

logger.log(`Starting migration script.`);

const runScript = EnvironmentVariables.getEnvVariableAsBoolean({
  fieldName: 'RUN_MIGRATION_SCRIPT',
  defaultValue: 0,
});

if (!runScript) {
  logger.log(
    'RUN_MIGRATION_SCRIPT is set to false. We will not run the migration script.'
  );
  process.exit();
}

const apiKey = EnvironmentVariables.getEnvVariableAsString({
  fieldName: 'FUSION_AUTH_ADMIN_API_KEY',
});
const baseUrl = EnvironmentVariables.getEnvVariableAsString({
  fieldName: 'FUSION_AUTH_BASE_URL',
});

const fa = new FusionAuthClient(apiKey, baseUrl);

logger.log(
  'Warning: this script is not robust to changes in the app; it spells out explicitly processes that are encapsulated in domain object methods in the app, since it does not use the whole NestJS shebang to run.'
);

const main = async () => {
  const tenantsResponse = await fa.retrieveTenants();
  logger.log(JSON.stringify(tenantsResponse));
  const tenants = tenantsResponse.response.tenants;
  if (!tenants) {
    throw new Error('tenantsResponse.response.tenants is falsy');
  }
  logger.log(`Found ${tenants.length} tenants.`);

  const anomalousTenants: Tenant[] = [];
  const processedTenants: Tenant[] = [];
  const noopTenants: Tenant[] = [];

  try {
    for (const tenant of tenants) {
      logger.log(
        `Inspecting tenant having id: ${tenant.id} to see whether migration is needed. This script will only migrate tenants with an expected bambu-go-connect application registered to it. It will report every anomalous tenant.`
      );
      const tfa = new FusionAuthClient(apiKey, baseUrl, tenant.id);
      const appsResponse = await tfa.retrieveApplications();
      const apps = appsResponse.response.applications;
      if (!apps?.length) {
        anomalousTenants.push(tenant);
        logger.log(
          `Tenant having id: ${tenant.id} has no applications. This is anomalous and will be skipped.`
        );
        continue;
      }
      if (apps.length == 2) {
        if (
          apps.some((app) => {
            return (
              app.name?.includes('bambu-go-connect') && app.id === tenant.id
            );
          }) &&
          apps.some((app) => {
            return app.name?.includes('bambu-go-transact');
          })
        ) {
          noopTenants.push(tenant);
          logger.log(
            `Tenant having id: ${tenant.id} has already been migrated. This is a noop and will be skipped.`
          );
        } else {
          anomalousTenants.push(tenant);
          logger.log(
            `Tenant having id: ${tenant.id} has an unexpected application. This is anomalous and will be skipped.`
          );
        }
        continue;
      }
      if (apps.length !== 1) {
        anomalousTenants.push(tenant);
        logger.log(
          `Tenant having id: ${tenant.id} has more than one application. This is anomalous and will be skipped.`
        );
        continue;
      }
      if (
        !apps[0].name?.includes('bambu-go-connect') ||
        apps[0].id !== tenant.id
      ) {
        anomalousTenants.push(tenant);
        logger.log(
          `Tenant having id: ${tenant.id} has an unexpected application. This is anomalous and will be skipped.`
        );
        continue;
      }

      const sdkUserResponse = await tfa.searchUsersByQuery({
        search: {
          numberOfResults: 2,
          queryString: `*`,
          orderBy: 'insertInstant DESC',
        },
      });

      const users = sdkUserResponse.response.users;
      if (sdkUserResponse.response.total !== 1) {
        anomalousTenants.push(tenant);
        logger.log(
          `Tenant having id: ${tenant.id} has ${users?.length} users. We expect 1. This is anomalous and will be skipped.`
        );
        continue;
      }
      const su = users?.[0];
      if (!su || !su.id) {
        anomalousTenants.push(tenant);
        logger.log(
          `Tenant having id: ${tenant.id} is undefined. This is anomalous and will be skipped.`
        );
        continue;
      }
      if (su?.memberships?.length !== 3) {
        anomalousTenants.push(tenant);
        logger.log(
          `Tenant having id: ${tenant.id} has ${su?.memberships?.length} memberships. We expect 3. This is anomalous and will be skipped.`
        );
        continue;
      }
      const transactApplicationName = `bambu-go-transact-${tenant.name}`;

      logger.log(
        `Creating tenant application (${transactApplicationName}) with groups.`
      );
      const applicationRequest: ApplicationRequest = {
        application: {
          data: {},
          loginConfiguration: {
            allowTokenRefresh: true,
            generateRefreshTokens: true,
            requireAuthentication: false,
          },
          name: transactApplicationName,
          registrationDeletePolicy: {
            unverified: {
              enabled: false,
              numberOfDaysToRetain: 120,
            },
          },
          roles: [],
          tenantId: tenant.id,
        },
      };
      logger.log(`search response: ${JsonUtils.Stringify(sdkUserResponse)}`);

      IamDto.DEFAULT_ROLES.forEach((role) => {
        applicationRequest?.application?.roles?.push({
          ...role,
        });
      });

      const applicationId = crypto.randomUUID();

      const sdkResult = await tfa.createApplication(
        applicationId,
        applicationRequest
      );

      const application = sdkResult.response.application;

      if (!application) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          `Sdk result did not define application. Received: ${application}.`
        );
      }

      logger.log(
        `Application created with id: ${applicationId}. Proceeding to create groups.`
      );

      const rolesInApplication = application.roles;
      if (!rolesInApplication) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          `Application does not have any roles. Received: ${rolesInApplication}.`
        );
      }
      const groups = rolesInApplication.map((role) => ({
        groupId: crypto.randomUUID(),
        singletonRoleId: role.id as string,
        groupName: `${application.id}-${role.name}`,
      }));
      logger.log(`Creating default groups for tenant and application.`);
      logger.log(`Input: ${JSON.stringify(groups)}.`);

      const groupCreationPromises = groups.map(
        async ({ groupId, singletonRoleId, groupName }) => {
          logger.log(`Creating group ${groupName}) for tenant (${tenant.id}).`);
          const sdkResult = await tfa.createGroup(groupId, {
            group: {
              name: groupName,
              tenantId: tenant.id,
            },
            roleIds: [singletonRoleId],
          });
          return sdkResult.response;
        }
      );

      const groupCreationResults = await Promise.all(groupCreationPromises);
      const iamServiceTenantTransactAdminUserGroups =
        groupCreationResults.filter((x) => {
          const group = x.group;
          return (
            group &&
            tenant.id === group.tenantId &&
            group.roles &&
            group.roles[applicationId] &&
            group.roles[applicationId].some(
              ({ name }) =>
                name &&
                IamDto.DEFAULT_SUPER_USER_ROLES.map(
                  ({ name: suName }) => suName
                ).includes(name)
            )
          );
        });

      logger.log(`Default groups created for tenant and application.`);
      for (
        let i = 0;
        i < iamServiceTenantTransactAdminUserGroups.length;
        i += 1
      ) {
        const group = iamServiceTenantTransactAdminUserGroups[i];
        const sdkRes = await tfa.createGroupMembers({
          members: {
            [group.group?.id as string]: [
              {
                userId: su.id as string,
              },
            ],
          },
        });
        logger.log(`sdkRes`, JsonUtils.Stringify(sdkRes));
      }
      processedTenants.push(tenant);
    }
    logger.log(
      'We will now proceed to print to STDERR a json of the `anomalousTenants`, the `processedTenants` (for which we have just now created a transact application), and the `noopTenants` (for which we have previously already created a transact application).'
    );
    logger.log(
      JSON.stringify({ anomalousTenants, processedTenants, noopTenants })
    );
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logger.log((error as any)?.exception);
    logger.log(
      'Error while processing tenants. We will print to STDERR the tenants that we have looked at so far.'
    );
    logger.error(
      JSON.stringify({ anomalousTenants, processedTenants, noopTenants })
    );
    /**
     * We exit with a non-zero exit code so that the script fails.
     */
    process.exit();
  }
};

(async () => {
  await main();
})();
