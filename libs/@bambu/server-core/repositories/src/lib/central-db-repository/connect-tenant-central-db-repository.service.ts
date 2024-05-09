import {
  CentralDbPrismaService,
  PrismaModel,
} from '@bambu/server-core/db/central-db';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { ConnectAdvisorDto } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import {
  getDbRepositoryConfig,
  IDbRepositoryConfig,
} from '../base-classes/prisma-repository/prisma-db.config';

@Injectable()
export class ConnectTenantCentralDbRepositoryService {
  readonly #logger: Logger = new Logger(
    ConnectTenantCentralDbRepositoryService.name
  );
  readonly #dbRepoConfig: IDbRepositoryConfig;

  constructor(private readonly prisma: CentralDbPrismaService) {
    this.#dbRepoConfig = getDbRepositoryConfig();
  }

  public async GetConnectTenantTopLevelSettings({
    requestId,
    tenantId,
  }: {
    requestId: string;
    tenantId: string;
  }): Promise<Pick<
    PrismaModel.ConnectTenant,
    'incomeThreshold' | 'contactLink' | 'retireeSavingsThreshold'
  > | null> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.GetConnectTenantTopLevelSettings.name,
      requestId
    );

    this.#logger.debug(
      `${logPrefix} Getting connect tenant top level settings for tenant (${tenantId}).`
    );

    try {
      const result = this.prisma.connectTenant.findFirst({
        where: {
          tenantId,
        },
        select: {
          incomeThreshold: true,
          contactLink: true,
          retireeSavingsThreshold: true,
        },
      });

      this.#logger.debug(
        [
          `${logPrefix} Successfully acquired connect tenant top level settings for tenant (${tenantId}).`,
          `Details: ${result ? JsonUtils.Stringify(result) : 'null'}.`,
        ].join('')
      );

      return result;
    } catch (error) {
      this.#logger.error(
        [
          `${logPrefix} Error updating connect tenant top level settings for tenantId (${tenantId}).`,
          `Details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );

      throw error;
    }
  }

  public async UpdateConnectTenantTopLevelSettings({
    requestId,
    updatedBy,
    tenantId,
    incomeThreshold,
    retireeSavingsThreshold,
    contactLink,
    timeStamp,
  }: {
    requestId: string;
    updatedBy: string;
    tenantId: string;
    incomeThreshold: number;
    retireeSavingsThreshold: number;
    contactLink: string;
    timeStamp?: Date;
  }): Promise<
    Pick<
      PrismaModel.ConnectTenant,
      'incomeThreshold' | 'contactLink' | 'retireeSavingsThreshold'
    >
  > {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UpdateConnectTenantTopLevelSettings.name,
      requestId
    );
    const input = {
      requestId,
      updatedBy,
      tenantId,
      incomeThreshold,
      retireeSavingsThreshold,
      contactLink,
      timeStamp,
    };
    this.#logger.debug(`${logPrefix} Input: ${JsonUtils.Stringify(input)}.`);

    try {
      const result = await this.prisma.connectTenant.update({
        where: {
          tenantId,
        },
        data: {
          incomeThreshold,
          retireeSavingsThreshold,
          contactLink,
          updatedBy,
          updatedAt: !timeStamp
            ? new Date().toISOString()
            : timeStamp.toISOString(),
        },
        select: {
          incomeThreshold: true,
          contactLink: true,
          retireeSavingsThreshold: true,
        },
      });

      this.#logger.debug(
        [
          `${logPrefix} Successfully updated connect tenant top level settings.`,
          `Details: ${JsonUtils.Stringify(result)}.`,
        ].join('')
      );

      return result;
    } catch (error) {
      this.#logger.error(
        [
          `${logPrefix} Error updating connect tenant top level settings.`,
          `Input: ${JsonUtils.Stringify(input)}`,
          `Details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );

      throw error;
    }
  }

  public async GetConnectTenantByTenantId(
    tenantId: string
  ): Promise<PrismaModel.ConnectTenant | null> {
    const result = await this.prisma.connectTenant.findFirst({
      where: {
        tenantId,
      },
    });

    if (!result) {
      return null;
    }

    return {
      ...result,
      setupState: result.setupState
        ? (result.setupState as unknown as ConnectAdvisorDto.IConnectAdvisorProfileInformationSetupStateDto)
        : null,
    };
  }

  public async UpdateConnectTenantSetupState(
    requestId: string,
    tenantId: string,
    setupState: Partial<ConnectAdvisorDto.IConnectAdvisorProfileInformationSetupStateDto>,
    requesterId?: string
  ) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UpdateConnectTenantSetupState.name,
      requestId
    );
    const input = { tenantId, setupState };

    const currentTenant = await this.GetConnectTenantByTenantId(tenantId);

    if (!currentTenant) {
      this.#logger.error(
        `${logPrefix} Missing tenant in db. Details: ${JsonUtils.Stringify(
          input
        )}.`
      );
      throw ErrorUtils.getDefaultMissingTenantInDbErrorWithTenantId({
        tenantId,
        requestId,
        metadata: {
          setupState,
        },
      });
    }

    /**
     * This is here because the migration did not migrate the users effectively.
     *
     * This won't happen because new users are initialized with the correct values.
     * This is primarily for the users that were created before the migration.
     */
    this.#logger.debug(
      `${logPrefix} Checking for missing setup state. Data: ${JsonUtils.Stringify(
        currentTenant
      )}.`
    );
    if (!currentTenant.setupState) {
      const defaultValues: ConnectAdvisorDto.IConnectAdvisorProfileInformationSetupStateDto =
        {
          hasUpdatedContent: false,
          hasUpdatedPortfolios: false,
          hasUpdatedLeadSettings: false,
          hasUpdatedGoals: false,
          hasUpdatedBranding: false,
        };

      await this.prisma.connectTenant.update({
        where: {
          tenantId,
        },
        data: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setupState: defaultValues as Record<string, any>,
        },
      });
    }

    const updatePayload: Partial<ConnectAdvisorDto.IConnectAdvisorProfileInformationSetupStateDto> =
      {
        ...setupState,
      };

    const updatedBy = requesterId
      ? requesterId
      : this.#dbRepoConfig.serviceUser;

    const updatedFields: string[] = Object.keys(updatePayload);

    for (let i = 0; i < updatedFields.length; i += 1) {
      const key: string = updatedFields[i];
      const dbKey = `{${key}}`;
      const rawValue: boolean = (updatePayload as Record<string, boolean>)[key];
      const value: string = rawValue ? 'true' : 'false';
      await this.prisma.$queryRaw`
        UPDATE connect_tenant
        SET setup_state = jsonb_set(setup_state, ${dbKey}::text[], ${value}::jsonb),
            updated_by  = ${updatedBy},
            updated_at  = ${new Date()}
        WHERE tenant_id = ${tenantId}
      `;
    }
  }
}
