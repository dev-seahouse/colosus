import { PrismaClient } from '@bambu/colossus/prisma/central-db';
import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class CentralDbPrismaService
  extends PrismaClient
  implements OnModuleInit, OnApplicationShutdown
{
  readonly #logger: Logger = new Logger(CentralDbPrismaService.name);

  async onModuleInit() {
    this.#logger.log(`Opening DB connection.`);
    await this.$connect();
    this.#logger.log(`Opened DB connection.`);
  }

  async onApplicationShutdown(signal: string) {
    this.#logger.log(`Shutdown signal received. Signal is (${signal}).`);

    this.#logger.log(`Closing DB connection.`);
    await this.$disconnect();
    this.#logger.log(`Closed DB connection.`);
  }
}
