import {
  CentralDbPrismaService,
  PrismaModel,
} from '@bambu/server-core/db/central-db';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { ConnectAdvisorDto, SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import _ from 'lodash';
import * as Luxon from 'luxon';
import {
  getDbRepositoryConfig,
  IDbRepositoryConfig,
} from '../base-classes/prisma-repository/prisma-db.config';

export abstract class ConnectAdvisorPreferencesCentralDbRepositoryServiceBase {
  public abstract GetConnectAdvisorPreferences(
    requestId: string,
    userId: string,
    tenantId: string
  ): Promise<PrismaModel.ConnectAdvisorPreferences | null>;

  public abstract UpsertConnectAdvisorPreferences(
    requestId: string,
    payload: ConnectAdvisorDto.IConnectAdvisorPreferencesMutableDto
  ): Promise<PrismaModel.ConnectAdvisorPreferences>;
}

@Injectable()
export class ConnectAdvisorPreferencesCentralDbRepositoryService
  implements ConnectAdvisorPreferencesCentralDbRepositoryServiceBase
{
  readonly #logger: Logger = new Logger(
    ConnectAdvisorPreferencesCentralDbRepositoryService.name
  );
  readonly #dbRepoConfig: IDbRepositoryConfig;

  constructor(private readonly prisma: CentralDbPrismaService) {
    this.#dbRepoConfig = getDbRepositoryConfig();
  }

  public async GetConnectAdvisorPreferences(
    requestId: string,
    userId: string,
    tenantId: string
  ): Promise<PrismaModel.ConnectAdvisorPreferences | null> {
    const loggingPrefix: string = LoggingUtils.generateLogPrefix(
      this.GetConnectAdvisorPreferences.name,
      requestId
    );
    this.#logger.debug(
      `${loggingPrefix} Getting connect advisor preferences for user (${userId}) belonging to tenant (${tenantId}).`
    );
    try {
      const connectAdvisorPreferences =
        await this.prisma.connectAdvisorPreferences.findFirst({
          where: {
            userId,
            tenantId,
          },
        });
      this.#logger.debug(
        `${loggingPrefix} Got connect advisor preferences for user (${userId}) belonging to tenant (${tenantId}).`
      );

      if (!connectAdvisorPreferences) {
        this.#logger.debug(
          `${loggingPrefix} Details: No connect advisor preferences found.`
        );
      } else {
        this.#logger.debug(
          `${loggingPrefix} Details: ${JsonUtils.Stringify(
            connectAdvisorPreferences
          )}.`
        );
      }

      return connectAdvisorPreferences;
    } catch (error) {
      this.#logger.error(
        `${loggingPrefix} Error getting connect advisor preferences for user (${userId}) belonging to tenant (${tenantId}). Error: ${JsonUtils.Stringify(
          error
        )}`
      );
      throw error;
    }
  }

  public async UpsertConnectAdvisorPreferences(
    requestId: string,
    payload: ConnectAdvisorDto.IConnectAdvisorPreferencesMutableDto
  ): Promise<PrismaModel.ConnectAdvisorPreferences> {
    const loggingPrefix: string = LoggingUtils.generateLogPrefix(
      this.UpsertConnectAdvisorPreferences.name,
      requestId
    );
    this.#logger.debug(
      `${loggingPrefix} Performing upsert of connect advisor preferences for user (${payload.userId}) belonging to tenant (${payload.tenantId}).`
    );
    this.#logger.debug(
      `${loggingPrefix} Payload: ${JsonUtils.Stringify(payload)}.`
    );
    try {
      const { userId, tenantId } = payload;

      const updatePayload: ConnectAdvisorDto.IConnectAdvisorPreferencesMutableDto =
        this.ensureUpsertPayloadIsViable(requestId, payload);

      const result = await this.prisma.connectAdvisorPreferences.upsert({
        where: {
          tenantId_userId: {
            tenantId,
            userId,
          },
        },
        create: {
          ...updatePayload,
        },
        update: {
          minimumRetirementSavingsThreshold:
            updatePayload.minimumRetirementSavingsThreshold,
          minimumAnnualIncomeThreshold:
            updatePayload.minimumAnnualIncomeThreshold,
          updatedAt: updatePayload.updatedAt,
          updatedBy: updatePayload.updatedBy,
        },
      });
      this.#logger.debug(
        `${loggingPrefix} Performed upsert on connect advisor preferences for user (${payload.userId}) belonging to tenant (${payload.tenantId}).`
      );
      this.#logger.debug(
        `${loggingPrefix} Result: ${JsonUtils.Stringify(result)}.`
      );
      return result;
    } catch (error) {
      this.#logger.error(
        `${loggingPrefix} Error performing upsert on connect advisor preferences for user (${
          payload.userId
        }) belonging to tenant (${
          payload.tenantId
        }). Error: ${JsonUtils.Stringify(error)}`
      );
      throw error;
    }
  }

  private ensureUpsertPayloadIsViable(
    requestId: string,
    payload: ConnectAdvisorDto.IConnectAdvisorPreferencesMutableDto
  ): ConnectAdvisorDto.IConnectAdvisorPreferencesMutableDto {
    const updatePayload: ConnectAdvisorDto.IConnectAdvisorPreferencesMutableDto =
      _.cloneDeep(payload);

    Object.keys(payload).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((payload as Record<string, any>)[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (updatePayload as Record<string, any>)[key];
      }
    });

    if (Object.keys(updatePayload).length < 1) {
      throw new ErrorUtils.ColossusError(
        `Payload is not viable for upsert.`,
        requestId,
        {
          payload,
          updatePayload,
        },
        400,
        SharedEnums.ErrorCodes.GenericErrorCodesEnum.MALFORMED_REQUEST
      );
    }

    const timeStamp = Luxon.DateTime.now().toJSDate();
    updatePayload.updatedAt = !payload.updatedAt
      ? timeStamp
      : payload.updatedAt;
    updatePayload.createdAt = !payload.createdAt
      ? timeStamp
      : payload.createdAt;
    const { serviceUser } = this.#dbRepoConfig;
    updatePayload.updatedBy = !payload.updatedBy
      ? serviceUser
      : payload.updatedBy;
    updatePayload.createdBy = !payload.createdBy
      ? serviceUser
      : payload.createdBy;

    return updatePayload;
  }
}
