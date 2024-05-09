import { Injectable, Logger } from '@nestjs/common';
import { CentralDbPrismaService } from '@bambu/server-core/db/central-db';
import { Prisma, PrismaModel } from '@bambu/server-core/db/central-db';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import { PrismaRepository, IPrismaRepositoryMapTypeDto } from '../base-classes';

class TenantSubscriptionsMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.TenantSubscriptionAggregateArgs;
  count!: Prisma.TenantSubscriptionCountArgs;
  create!: Prisma.TenantSubscriptionCreateArgs;
  delete!: Prisma.TenantSubscriptionDeleteArgs;
  deleteMany!: Prisma.TenantSubscriptionDeleteArgs;
  findFirst!: Prisma.TenantSubscriptionFindFirstArgs;
  findMany!: Prisma.TenantSubscriptionFindManyArgs;
  findUnique!: Prisma.TenantSubscriptionFindUniqueArgs;
  update!: Prisma.TenantSubscriptionUpdateArgs;
  updateMany!: Prisma.TenantSubscriptionUpdateManyArgs;
  upsert!: Prisma.TenantSubscriptionUpsertArgs;
}

@Injectable()
export class TenantSubscriptionsCentralDbRepositoryService extends PrismaRepository<
  Prisma.TenantSubscriptionDelegate<Prisma.RejectPerOperation>,
  TenantSubscriptionsMapType
> {
  readonly #logger = new Logger(
    TenantSubscriptionsCentralDbRepositoryService.name
  );

  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.tenantSubscription);
  }

  public async UpsertRow(
    input: PrismaModel.TenantSubscription,
    requestId: string
  ): Promise<PrismaModel.TenantSubscription> {
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

    if (!input.id) {
      const nullIdErrorMessage =
        'Id for record not generated. This is not allowed.';
      const nullIdError = new ErrorUtils.ColossusError(
        nullIdErrorMessage,
        requestId,
        {
          input,
        }
      );

      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(nullIdError)}`);

      throw nullIdError;
    }

    try {
      const payload: Prisma.TenantSubscriptionUpsertArgs = {
        where: {
          id: input.id,
        },
        create: {
          ...input,
          updatedBy: !input.updatedBy
            ? super.dbRepoConfig.serviceUser
            : input.updatedBy,
          createdBy: !input.createdBy
            ? super.dbRepoConfig.serviceUser
            : input.createdBy,
        },
        update: {
          subscriptionMetadata: input.subscriptionMetadata,
          updatedBy: !input.updatedBy
            ? super.dbRepoConfig.serviceUser
            : input.updatedBy,
          tenantId: input.tenantId,
          updatedAt: input.updatedAt,
          subscriptionProviderProductId: input.subscriptionProviderProductId,
          subscriptionProviderName: input.subscriptionProviderName,
          status: input.status,
          subscriptionProviderCustomerId: input.subscriptionProviderCustomerId,
          providerSubscriptionId: input.providerSubscriptionId,
        },
      };

      const result = await this.prisma.tenantSubscription.upsert(payload);

      this.#logger.debug(
        [
          `${logPrefix} Created/updated record tenant subscription record.`,
          `Input: ${JsonUtils.Stringify(result)}.`,
        ].join(' ')
      );

      return result as PrismaModel.TenantSubscription;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Encountered unknown error while creating/updating subscription.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);

      throw error;
    }
  }

  public async UpdateRow(
    input: PrismaModel.TenantSubscription,
    requestId: string
  ): Promise<PrismaModel.TenantSubscription> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.UpdateRow.name,
      requestId
    );

    this.#logger.debug(
      [
        `${logPrefix} Updating record tenant subscription record.`,
        `Input: ${JsonUtils.Stringify(input)}`,
      ].join(' ')
    );

    if (!input.id) {
      const nullIdErrorMessage =
        'Id for record not generated. This is not allowed.';
      const nullIdError = new ErrorUtils.ColossusError(
        nullIdErrorMessage,
        requestId,
        {
          input,
        }
      );

      this.#logger.error(`${logPrefix} ${JsonUtils.Stringify(nullIdError)}`);

      throw nullIdError;
    }

    try {
      const payload: Prisma.TenantSubscriptionUpdateArgs = {
        where: { id: input.id },
        data: {
          subscriptionMetadata: input.subscriptionMetadata,
          updatedBy: !input.updatedBy
            ? super.dbRepoConfig.serviceUser
            : input.updatedBy,
          updatedAt: input.updatedAt,
          subscriptionProviderProductId: input.subscriptionProviderProductId,
          subscriptionProviderName: input.subscriptionProviderName,
          status: input.status,
          subscriptionProviderCustomerId: input.subscriptionProviderCustomerId,
          providerSubscriptionId: input.providerSubscriptionId,
          bambuGoProductId: input.bambuGoProductId,
        },
      };

      const result = await this.prisma.tenantSubscription.update(payload);
      this.#logger.debug(
        [
          `${logPrefix} Created/updated record tenant subscription record.`,
          `Input: ${JsonUtils.Stringify(result)}.`,
        ].join(' ')
      );

      return result as PrismaModel.TenantSubscription;
    } catch (error) {
      const errorMessage = [
        `${logPrefix} Encountered unknown error while creating/updating subscription.`,
        `Input: ${JsonUtils.Stringify(input)}.`,
      ].join(' ');

      this.#logger.error(errorMessage);

      throw error;
    }
  }
}
