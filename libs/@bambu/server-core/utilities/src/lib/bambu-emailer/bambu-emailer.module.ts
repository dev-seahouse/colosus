import {
  getDefaultBambuEmailerConfiguration,
  IBambuEmailerConfig,
} from '@bambu/server-core/configuration';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  BambuEventEmitterModule,
  BambuEventEmitterService,
} from '../bambu-event-emitter';
import { BambuEmailerService } from './bambu-emailer.service';
import { BambuEmailerServiceBase } from './bambu-emailer-service.base';

@Module({
  imports: [
    ConfigModule.forFeature(getDefaultBambuEmailerConfiguration),
    BambuEventEmitterModule,
  ],
  providers: [
    {
      provide: BambuEmailerServiceBase,
      useFactory: (
        configService: ConfigService,
        eventEmitter: BambuEventEmitterService
      ) => {
        const defaultTransport: IBambuEmailerConfig['defaultTransport'] =
          configService.get<IBambuEmailerConfig['defaultTransport']>(
            'defaultTransport'
          ) || getDefaultBambuEmailerConfiguration().defaultTransport;

        if (!defaultTransport) {
          throw new Error('Invalid transport configuration');
        }

        const logger = new Logger('BambuEmailerModule');

        logger.log(`Initialising Emailer Module`);
        return new BambuEmailerService(
          {
            defaultTransport:
              defaultTransport ||
              getDefaultBambuEmailerConfiguration().defaultTransport,
          },
          eventEmitter,
          logger
        );
      },
      inject: [ConfigService, BambuEventEmitterService],
    },
  ],
  exports: [BambuEmailerServiceBase],
})
export class BambuEmailerModule {}
