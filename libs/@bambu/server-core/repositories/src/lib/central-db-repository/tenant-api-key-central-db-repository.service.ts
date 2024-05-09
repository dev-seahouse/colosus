import {
  CentralDbPrismaService,
  Prisma,
  PrismaModel,
} from '@bambu/server-core/db/central-db';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { SharedEnums } from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import * as Luxon from 'luxon';
import { IPrismaRepositoryMapTypeDto, PrismaRepository } from '../base-classes';

class TenantApiKeyMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.TenantApiKeyAggregateArgs;
  count!: Prisma.TenantApiKeyCountArgs;
  create!: Prisma.TenantApiKeyCreateArgs;
  delete!: Prisma.TenantApiKeyDeleteArgs;
  deleteMany!: Prisma.TenantApiKeyDeleteManyArgs;
  findFirst!: Prisma.TenantApiKeyFindFirstArgs;
  findMany!: Prisma.TenantApiKeyFindManyArgs;
  findUnique!: Prisma.TenantApiKeyFindUniqueArgs;
  update!: Prisma.TenantApiKeyUpdateArgs;
  updateMany!: Prisma.TenantApiKeyUpdateManyArgs;
  upsert!: Prisma.TenantApiKeyUpsertArgs;
}

@Injectable()
export class TenantApiKeyCentralDbRepository extends PrismaRepository<
  Prisma.TenantApiKeyDelegate<Prisma.RejectPerOperation>,
  TenantApiKeyMapType
> {
  readonly #logger = new Logger(TenantApiKeyCentralDbRepository.name);

  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.tenantApiKey);
  }

  async UpsertRow(requestId: string, input: PrismaModel.TenantApiKey) {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UpsertRow.name,
      requestId
    );

    this.#logger.debug(
      [
        `${logPrefix} Creating/updating record tenant subscription record.`,
        `Input: ${JsonUtils.Stringify(input)}`,
      ].join(' ')
    );

    try {
      // const result = await this.prisma.tenantApiKey.upsert({
      //   where: {
      //     tenantId: input.tenantId,
      //     keyType: input.keyType,
      //   },
      //   create: {
      //     tenantId: input.tenantId,
      //     keyConfig: input.keyConfig,
      //     keyType: input.keyType,
      //     createdBy: this.dbRepoConfig.serviceUser,
      //     updatedBy: this.dbRepoConfig.serviceUser,
      //   },
      //   update: {
      //     updatedBy: this.dbRepoConfig.serviceUser,
      //     updatedAt: Luxon.DateTime.fromJSDate(new Date()).toISO(),
      //     tenantId: input.tenantId,
      //     keyConfig: input.keyConfig,
      //     keyType: input.keyType,
      //   },
      // });

      let result = await this.prisma.tenantApiKey.findFirst({
        where: {
          tenantId: input.tenantId,
          keyType: input.keyType,
        },
      });

      if (!result) {
        result = await this.prisma.tenantApiKey.create({
          data: {
            tenantId: input.tenantId,
            keyConfig: input.keyConfig,
            keyType: input.keyType,
            createdBy: this.dbRepoConfig.serviceUser,
            updatedBy: this.dbRepoConfig.serviceUser,
          },
        });
      } else {
        result = await this.prisma.tenantApiKey.update({
          where: {
            id: result.id,
          },
          data: {
            updatedBy: this.dbRepoConfig.serviceUser,
            updatedAt: Luxon.DateTime.fromJSDate(new Date()).toISO(),
            tenantId: input.tenantId,
            keyConfig: input.keyConfig,
            keyType: input.keyType,
          },
        });
      }

      return result as PrismaModel.TenantApiKey;
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Encountered unknown error while creating/updating api keys.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);

      throw error;
    }
  }

  public async GetApiKeysByTenantIdAndType(
    requestId: string,
    tenantId: string,
    keyType: SharedEnums.ApiKeyTypeEnum
  ): Promise<PrismaModel.TenantApiKey | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetApiKeysByTenantIdAndType.name,
      requestId
    );
    const loggingPayload: Record<string, unknown> = {
      tenantId,
    };
    this.#logger.debug(
      `${logPrefix} Attempting to retrieve api keys for tenant, input: ${JsonUtils.Stringify(
        loggingPayload
      )}.`
    );
    try {
      const result = await this.prisma.tenantApiKey.findFirst({
        where: {
          tenantId,
          keyType,
        },
      });

      if (!result) {
        this.#logger.debug(`${logPrefix} No api keys found for tenant.`);
        return null;
      } else {
        this.#logger.debug(
          `${logPrefix} Successfully retrieved api keys for tenant. Result: ${JsonUtils.Stringify(
            result
          )}.`
        );
      }

      return result as PrismaModel.TenantApiKey;
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Encountered unknown error while retrieving api keys for tenant.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);

      throw error;
    }
  }

  public async GetApiKeyEntriesByType(
    requestId: string,
    type: SharedEnums.ApiKeyTypeEnum,
    pageIndex: number,
    pageSize: number
  ): Promise<PrismaModel.TenantApiKey[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetApiKeyEntriesByType.name,
      requestId
    );
    const loggingPayload = {
      type,
      pageIndex,
      pageSize,
    };
    try {
      this.#logger.debug(
        `${logPrefix} Attempting to retrieve api keys for tenant, input: ${JsonUtils.Stringify(
          loggingPayload
        )}.`
      );

      const result = await this.prisma.tenantApiKey.findMany({
        where: {
          keyType: type,
        },
        skip: pageIndex * pageSize,
        take: pageSize,
      });

      this.#logger.debug(
        `${logPrefix} Successfully retrieved api keys for tenant. Result: ${JsonUtils.Stringify(
          result
        )}.`
      );

      return result as PrismaModel.TenantApiKey[];
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Encountered unknown error while retrieving api keys for tenant.`,
        `Input: ${JsonUtils.Stringify(loggingPayload)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);

      throw error;
    }
  }
}
