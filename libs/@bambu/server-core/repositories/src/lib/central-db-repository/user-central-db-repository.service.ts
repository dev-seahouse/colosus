import {
  CentralDbPrismaService,
  Prisma,
  PrismaModel,
} from '@bambu/server-core/db/central-db';
import { JsonUtils, LoggingUtils } from '@bambu/server-core/utilities';
import { Injectable, Logger } from '@nestjs/common';
import { IPrismaRepositoryMapTypeDto, PrismaRepository } from '../base-classes';

class UserMapType implements IPrismaRepositoryMapTypeDto {
  aggregate!: Prisma.UserAggregateArgs;
  count!: Prisma.UserCountArgs;
  create!: Prisma.UserCreateArgs;
  delete!: Prisma.UserDeleteArgs;
  deleteMany!: Prisma.UserDeleteArgs;
  findFirst!: Prisma.UserFindFirstArgs;
  findMany!: Prisma.UserFindManyArgs;
  findUnique!: Prisma.UserFindUniqueArgs;
  update!: Prisma.UserUpdateArgs;
  updateMany!: Prisma.UserUpdateManyArgs;
  upsert!: Prisma.UserUpsertArgs;
}

@Injectable()
export class UserCentralDbRepositoryService extends PrismaRepository<
  Prisma.UserDelegate<Prisma.RejectPerOperation>,
  UserMapType
> {
  readonly #logger: Logger = new Logger(UserCentralDbRepositoryService.name);

  constructor(private readonly prisma: CentralDbPrismaService) {
    super(prisma.user);
  }

  public async CreateUser(
    requestId: string,
    newUser: Omit<PrismaModel.User, 'Tenant' | 'otps' | 'connectAdvisor'>
  ): Promise<Omit<PrismaModel.User, 'Tenant' | 'otps' | 'connectAdvisor'>> {
    const logPrefix = LoggingUtils.generateLogPrefix(
      this.CreateUser.name,
      requestId
    );

    this.#logger.debug(
      `${logPrefix} Input data: ${JsonUtils.Stringify(newUser)}`
    );

    try {
      const timeStamp = new Date().toISOString();

      const input: Prisma.UserCreateArgs = {
        data: {
          ...newUser,
          createdBy: !newUser.createdBy
            ? super.dbRepoConfig.serviceUser
            : newUser.createdBy,
          updatedBy: !newUser.updatedBy
            ? super.dbRepoConfig.serviceUser
            : newUser.updatedBy,
          createdAt: !newUser.createdAt ? timeStamp : newUser.createdAt,
          updatedAt: !newUser.updatedAt ? timeStamp : newUser.updatedAt,
        },
      };

      const result = await this.prisma.user.create(input);

      this.#logger.debug(`${logPrefix} Result: ${JsonUtils.Stringify(result)}`);

      return result;
    } catch (error) {
      const errorMessage: string = [
        `${logPrefix} Error creating user.`,
        `Input: ${JsonUtils.Stringify(newUser)}.`,
        `Error: ${JsonUtils.Stringify(error)}`,
      ].join(' ');

      this.#logger.error(errorMessage);

      throw error;
    }
  }

  public async GetCountOfUsersByTenantId(tenantId: string): Promise<number> {
    return await this.prisma.user.count({
      where: {
        tenantId,
      },
    });
  }

  public async GetUsersByTenantId(
    tenantId: string,
    pageIndex = 0,
    pageSize = 50
  ): Promise<PrismaModel.User[]> {
    return await this.prisma.user.findMany({
      where: {
        tenantId,
      },
      skip: pageIndex * pageSize,
      take: pageSize,
    });
  }

  public async GetUserByUserId(
    userId: string
  ): Promise<PrismaModel.User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
