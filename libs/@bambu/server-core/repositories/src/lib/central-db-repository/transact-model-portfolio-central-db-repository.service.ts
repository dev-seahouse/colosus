import { CentralDbPrismaService } from '@bambu/server-core/db/central-db';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import {
  IGetModelPortfolioByIdResponseDto,
  ITransactModelPortfolioDto,
  ITransactPortfolioInstrumentDto,
  ITransactPortfolioInstrumentMutableDto,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import {
  getDbRepositoryConfig,
  IDbRepositoryConfig,
} from '../base-classes/prisma-repository/prisma-db.config';

export abstract class TransactModelPortfolioCentralDbRepositoryServiceBase {
  public abstract UpsertTransactModelPortfolio(
    requestId: string,
    tenantId: string,
    payload: ITransactModelPortfolioDto
  ): Promise<ITransactModelPortfolioDto>;

  public abstract DeleteTransactPortfolioInstrumentsByModelPortfolioId(
    requestId: string,
    tenantId: string,
    transactModelPortfolioId: string
  ): Promise<number>;

  public abstract UpsertTransactModelPortfolioInstrument(
    requestId: string,
    tenantId: string,
    payload: ITransactPortfolioInstrumentMutableDto,
    requesterUserId?: string
  ): Promise<ITransactPortfolioInstrumentDto>;

  public abstract GetModelPortfolioById(
    requestId: string,
    tenantId: string,
    id: string
  ): Promise<IGetModelPortfolioByIdResponseDto | null>;

  public abstract GetModelPortfoliosForTenant(
    requestId: string,
    tenantId: string
  ): Promise<IGetModelPortfolioByIdResponseDto[]>;

  public abstract UpdateTransactModelPortfolioPartnerModelId(
    requestId: string,
    id: string,
    partnerModelId: string
  ): Promise<number>;
}

@Injectable()
export class TransactModelPortfolioCentralDbRepositoryService
  implements TransactModelPortfolioCentralDbRepositoryServiceBase
{
  private readonly logger: Logger = new Logger(
    TransactModelPortfolioCentralDbRepositoryService.name
  );
  private readonly dbRepoConfig: IDbRepositoryConfig;

  constructor(private readonly prisma: CentralDbPrismaService) {
    this.dbRepoConfig = getDbRepositoryConfig();
  }

  public async UpdateTransactModelPortfolioPartnerModelId(
    requestId: string,
    id: string,
    partnerModelId: string
  ): Promise<number> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpdateTransactModelPortfolioPartnerModelId.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = { id, partnerModelId };
    try {
      this.logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
      );
      const result = await this.prisma.transactModelPortfolios.updateMany({
        where: {
          id,
        },
        data: {
          partnerModelId,
        },
      });
      this.logger.debug(`${logPrefix} Result: ${JsonUtils.Stringify(result)}`);
      return result.count;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while creating/updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async UpsertTransactModelPortfolio(
    requestId: string,
    tenantId: string,
    payload: ITransactModelPortfolioDto
  ): Promise<ITransactModelPortfolioDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertTransactModelPortfolio.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = { payload };
    try {
      this.logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
      );
      const createdBy: string =
        payload.createdBy || this.dbRepoConfig.serviceUser;
      const updatedBy: string =
        payload.updatedBy || this.dbRepoConfig.serviceUser;
      const timeStamp: Date = new Date();
      const createdAt: Date | string = payload.createdAt || timeStamp;
      const updatedAt: Date | string = payload.updatedAt || timeStamp;
      const upsertResult = await this.prisma.transactModelPortfolios.upsert({
        where: {
          id: payload.id,
          ConnectPortfolioSummary: {
            tenantId,
          },
        },
        update: {
          ...payload,
          updatedAt,
          updatedBy,
        },
        create: {
          ...payload,
          createdBy,
          createdAt,
          updatedAt,
          updatedBy,
        },
      });
      return {
        ...upsertResult,
        expectedAnnualReturn: upsertResult.expectedAnnualReturn
          ? upsertResult.expectedAnnualReturn.toNumber()
          : null,
        expectedAnnualVolatility: upsertResult.expectedAnnualVolatility
          ? upsertResult.expectedAnnualVolatility.toNumber()
          : null,
        rebalancingThreshold: upsertResult.rebalancingThreshold
          ? upsertResult.rebalancingThreshold.toNumber()
          : null,
      };
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while creating/updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      this.logger.debug(
        `${logPrefix} Rethrowing error. Input: ${JsonUtils.Stringify(
          loggingInput
        )}`
      );
      throw error;
    }
  }

  public async DeleteTransactPortfolioInstrumentsByModelPortfolioId(
    requestId: string,
    tenantId: string,
    transactModelPortfolioId: string
  ): Promise<number> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.DeleteTransactPortfolioInstrumentsByModelPortfolioId.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = { transactModelPortfolioId };
    try {
      this.logger.debug(
        `${logPrefix} Input: ${JsonUtils.Stringify(loggingInput)}`
      );
      const deleteResult =
        await this.prisma.transactModelPortfolioInstruments.deleteMany({
          where: {
            transactModelPortfolioId,
            TransactModelPortfolio: {
              ConnectPortfolioSummary: {
                tenantId,
              },
            },
          },
        });
      this.logger.debug(
        `${logPrefix} Delete result: ${JsonUtils.Stringify(deleteResult)}`
      );
      return deleteResult.count;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while creating/updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      throw error;
    }
  }

  public async UpsertTransactModelPortfolioInstrument(
    requestId: string,
    tenantId: string,
    payload: ITransactPortfolioInstrumentMutableDto,
    requesterUserId?: string
  ): Promise<ITransactPortfolioInstrumentDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.UpsertTransactModelPortfolioInstrument.name,
      requestId
    );
    const loggingInput: Record<string, unknown> = { payload, requesterUserId };
    try {
      const createdBy: string =
        requesterUserId || this.dbRepoConfig.serviceUser;
      const updatedBy: string =
        requesterUserId || this.dbRepoConfig.serviceUser;
      const timeStamp: Date = new Date();
      const createdAt: Date = timeStamp;
      const updatedAt: Date = timeStamp;
      const upsertResult =
        await this.prisma.transactModelPortfolioInstruments.upsert({
          where: {
            instrumentId_transactModelPortfolioId: {
              transactModelPortfolioId: payload.transactModelPortfolioId,
              instrumentId: payload.instrumentId,
            },
            TransactModelPortfolio: {
              ConnectPortfolioSummary: {
                tenantId,
              },
            },
          },
          create: {
            ...payload,
            createdBy,
            createdAt,
            updatedAt,
            updatedBy,
          },
          update: {
            weightage: payload.weightage,
            updatedAt,
            updatedBy,
          },
        });
      return {
        ...upsertResult,
        weightage: upsertResult.weightage.toNumber(),
      };
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while creating/updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      this.logger.debug(
        `${logPrefix} Rethrowing error. Input: ${JsonUtils.Stringify(
          loggingInput
        )}`
      );
      throw error;
    }
  }

  public async GetModelPortfolioById(
    requestId: string,
    tenantId: string,
    id: string
  ): Promise<IGetModelPortfolioByIdResponseDto | null> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetModelPortfolioById.name,
      requestId
    );
    const loggingInput = {
      tenantId,
      id,
    };
    try {
      const result = await this.prisma.transactModelPortfolios.findUnique({
        where: {
          id,
          ConnectPortfolioSummary: {
            tenantId,
          },
        },
        include: {
          TransactModelPortfolioInstruments: {
            include: {
              Instrument: {
                include: {
                  InstrumentExchange: true,
                  InstrumentCurrency: true,
                  InstrumentFactSheets: true,
                  InstrumentAssetClass: true,
                },
              },
            },
          },
        },
      });
      if (!result) {
        return null;
      }
      return {
        ...result,
        expectedAnnualReturn: result.expectedAnnualReturn
          ? result.expectedAnnualReturn.toNumber()
          : null,
        expectedAnnualVolatility: result.expectedAnnualVolatility
          ? result.expectedAnnualVolatility.toNumber()
          : null,
        rebalancingThreshold: result.rebalancingThreshold
          ? result.rebalancingThreshold.toNumber()
          : null,
        TransactModelPortfolioInstruments:
          result.TransactModelPortfolioInstruments.map((x) => {
            const { weightage } = x;
            return {
              ...x,
              weightage: weightage.toNumber(),
            };
          }),
      };
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while creating/updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      this.logger.debug(
        `${logPrefix} Rethrowing error. Input: ${JsonUtils.Stringify(
          loggingInput
        )}`
      );
      throw error;
    }
  }

  public async GetModelPortfoliosForTenant(
    requestId: string,
    tenantId: string
  ): Promise<IGetModelPortfolioByIdResponseDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetModelPortfoliosForTenant.name,
      requestId
    );
    const loggingInput = {
      tenantId,
    };
    try {
      /**
       * I just did this, so it would be easier to code.
       * We really should make this its own query.
       */
      const result = await this.prisma.transactModelPortfolios.findMany({
        where: {
          ConnectPortfolioSummary: {
            tenantId,
          },
        },
        select: { id: true },
      });
      const modelPortfolioIds = result.map((x) => x.id);
      const finalResult = await Promise.all(
        modelPortfolioIds.map((x) => {
          return this.GetModelPortfolioById(requestId, tenantId, x);
        })
      );
      return finalResult.filter(
        (x) => x !== null && x !== undefined
      ) as Array<IGetModelPortfolioByIdResponseDto>;
    } catch (error) {
      this.logger.error(
        [
          `${logPrefix} Error while creating/updating record.`,
          `Error details: ${JsonUtils.Stringify(error)}.`,
        ].join(' ')
      );
      this.logger.debug(
        `${logPrefix} Rethrowing error. Input: ${JsonUtils.Stringify(
          loggingInput
        )}`
      );
      throw error;
    }
  }
}
