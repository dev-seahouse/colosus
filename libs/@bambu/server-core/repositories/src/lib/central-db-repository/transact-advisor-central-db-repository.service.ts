import { CentralDbPrismaService } from '@bambu/server-core/db/central-db';
import {
  ErrorUtils,
  JsonUtils,
  LoggingUtils,
} from '@bambu/server-core/utilities';
import {
  ITransactAdvisorBankAccountDto,
  ITransactAdvisorBankAccountMutableDto,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import {
  getDbRepositoryConfig,
  IDbRepositoryConfig,
} from '../base-classes/prisma-repository/prisma-db.config';

export abstract class TransactAdvisorCentralDbRepositoryServiceBase {
  public abstract AddBankAccountDetails(
    requestId: string,
    tenantId: string,
    payload: ITransactAdvisorBankAccountMutableDto
  ): Promise<void>;

  public abstract GetBankAccountDetails(
    requestId: string,
    tenantId: string
  ): Promise<ITransactAdvisorBankAccountDto>;

  public abstract UpsertBankAccountDetailsByTenantId(
    requestId: string,
    payload: ITransactAdvisorBankAccountMutableDto,
    userId?: string
  ): Promise<ITransactAdvisorBankAccountDto>;
}

@Injectable()
export class TransactAdvisorCentralDbRepositoryService
  implements TransactAdvisorCentralDbRepositoryServiceBase
{
  private readonly logger: Logger = new Logger(
    TransactAdvisorCentralDbRepositoryService.name
  );
  private readonly dbRepoConfig: IDbRepositoryConfig;

  constructor(private readonly prisma: CentralDbPrismaService) {
    this.dbRepoConfig = getDbRepositoryConfig();
  }

  public async AddBankAccountDetails(
    requestId: string,
    tenantId: string,
    payload: ITransactAdvisorBankAccountMutableDto
  ): Promise<void> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.AddBankAccountDetails.name,
      requestId
    );

    const loggingInput: Record<string, unknown> = { requestId, tenantId };

    try {
      this.logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
      );

      const createdBy: string = this.dbRepoConfig.serviceUser;
      const updatedBy: string = this.dbRepoConfig.serviceUser;
      const timeStamp: Date = new Date();
      const createdAt: Date = timeStamp;
      const updatedAt: Date = timeStamp;

      await this.prisma.transactAdvisorBankAccount.create({
        data: {
          accountName: payload.accountName,
          accountNumber: payload.accountNumber,
          sortCode: payload.sortCode,
          annualManagementFee: payload.annualManagementFee,
          tenantId: tenantId,
          createdAt: createdAt,
          createdBy: createdBy,
          updatedAt: updatedAt,
          updatedBy: updatedBy,
        },
      });

      this.logger.debug(
        `${logPrefix} Successfullly Added Bank Account Details: ${JsonUtils.Stringify(
          loggingInput
        )}`
      );
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while getting adding/updating bank account for tenant: ${tenantId}.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async GetBankAccountDetails(
    requestId: string,
    tenantId: string
  ): Promise<ITransactAdvisorBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetBankAccountDetails.name,
      requestId
    );

    const loggingInput: Record<string, unknown> = { requestId, tenantId };
    try {
      this.logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
      );

      const result = await this.prisma.transactAdvisorBankAccount.findFirst({
        where: {
          tenantId: tenantId,
        },
      });

      if (!result) {
        throw new ErrorUtils.ColossusError(
          `Bank Account Not found for Tenant: ${tenantId}`,
          requestId,
          tenantId,
          404
        );
      }
      return result;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while getting advisor bank account for tenant: ${tenantId}`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async UpsertBankAccountDetailsByTenantId(
    requestId: string,
    payload: ITransactAdvisorBankAccountMutableDto,
    userId?: string
  ): Promise<ITransactAdvisorBankAccountDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertBankAccountDetailsByTenantId.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = { requestId, payload };
    this.logger.debug(
      `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
    );
    try {
      const { tenantId } = payload;
      const createdBy: string = userId || this.dbRepoConfig.serviceUser;
      const updatedBy: string = createdBy;
      const updatedAt: string = new Date().toISOString();
      const upsertResult = await this.prisma.transactAdvisorBankAccount.upsert({
        where: {
          tenantId,
        },
        create: {
          ...payload,
          createdBy,
          updatedBy,
        },
        update: {
          ...payload,
          updatedBy,
          updatedAt,
        },
      });
      return upsertResult;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error encountered.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }
}
