import {
  CentralDbPrismaService,
  Prisma,
} from '@bambu/server-core/db/central-db';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import {
  IInstrumentAssetClassDto,
  IInstrumentDto,
  IInstrumentsSearchResponseDto,
} from '@bambu/shared';
import { Injectable, Logger } from '@nestjs/common';
import {
  getDbRepositoryConfig,
  IDbRepositoryConfig,
} from '../base-classes/prisma-repository/prisma-db.config';

export abstract class InstrumentsCentralDbRepositoryServiceBase {
  public abstract GetInstrumentAssetClasses(
    requestId: string
  ): Promise<IInstrumentAssetClassDto[]>;

  public abstract GetInstruments(
    requestId: string,
    pageIndex: number,
    pageSize: number,
    searchString: string
  ): Promise<IInstrumentsSearchResponseDto>;

  public abstract GetInstrumentsByIds(
    requestId: string,
    instrumentIds: string[]
  ): Promise<IInstrumentDto[]>;
}

@Injectable()
export class InstrumentsCentralDbRepositoryService
  implements InstrumentsCentralDbRepositoryServiceBase
{
  private readonly logger = new Logger(
    InstrumentsCentralDbRepositoryService.name
  );
  private readonly dbRepoConfig: IDbRepositoryConfig;

  constructor(private readonly prisma: CentralDbPrismaService) {
    this.dbRepoConfig = getDbRepositoryConfig();
  }

  public async GetInstrumentAssetClasses(
    requestId: string
  ): Promise<IInstrumentAssetClassDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInstrumentAssetClasses.name,
      requestId
    );
    try {
      const dbRows = await this.prisma.instrumentAssetClasses.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      return dbRows as IInstrumentAssetClassDto[];
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

  public async GetInstruments(
    requestId: string,
    pageIndex: number,
    pageSize: number,
    searchString: string
  ): Promise<IInstrumentsSearchResponseDto> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInstruments.name,
      requestId
    );
    try {
      const whereClause: Prisma.InstrumentsFindManyArgs['where'] = {
        OR: [
          {
            bloombergTicker: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
          {
            ricSymbol: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
          {
            isin: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
          {
            cusip: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: searchString,
              mode: 'insensitive',
            },
          },
        ],
      };
      const [data, filteredCount, allTotalCount] = await Promise.all([
        this.prisma.instruments.findMany({
          skip: pageIndex * pageSize,
          take: pageSize,
          include: {
            InstrumentAssetClass: true,
            InstrumentCurrency: true,
            InstrumentExchange: true,
            InstrumentFactSheets: true,
          },
          where: whereClause,
        }),
        this.prisma.instruments.count({
          where: whereClause,
        }),
        this.prisma.instruments.count({}),
      ]);
      const pageCount: number = Math.ceil(filteredCount / pageSize);
      return {
        data,
        pageCount,
        filteredCount,
        allTotalCount,
      };
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

  public async GetInstrumentsByIds(
    requestId: string,
    instrumentIds: string[]
  ): Promise<IInstrumentDto[]> {
    const { logPrefix } = LoggingUtils.generateLoggingPrefix(
      this.GetInstrumentsByIds.name,
      requestId
    );
    try {
      this.logger.debug(
        `${logPrefix} Fetching instruments by ids. [${instrumentIds.join(
          ', '
        )}]`
      );

      const dbRows = await this.prisma.instruments.findMany({
        where: {
          id: {
            in: instrumentIds,
          },
        },
        include: {
          InstrumentAssetClass: true,
          InstrumentCurrency: true,
          InstrumentExchange: true,
          InstrumentFactSheets: true,
        },
      });

      this.logger.debug(
        `${logPrefix} Fetched instruments by ids. [${instrumentIds.join(', ')}]`
      );
      this.logger.debug(
        `${logPrefix} Fetch instruments by ids result: [${JsonUtils.Stringify(
          dbRows
        )}].`
      );

      return dbRows as IInstrumentDto[];
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
