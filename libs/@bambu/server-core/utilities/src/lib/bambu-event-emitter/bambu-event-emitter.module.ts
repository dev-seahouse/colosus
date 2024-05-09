import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  EventEmitter2,
  EventEmitterModule as NestEventEmitterModule,
} from '@nestjs/event-emitter';
import { BambuEventEmitterService } from './bambu-event-emitter.service';
import {
  getDefaultBambuEventEmitterConfiguration,
  IBambuEventEmitterConfig,
} from '@bambu/server-core/configuration';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(getDefaultBambuEventEmitterConfiguration),
    // These are all updated in the service in order to reflect the config
    NestEventEmitterModule.forRoot({
      delimiter: '.',
      global: true,
      newListener: false,
      removeListener: false,
      wildcard: true,
      verboseMemoryLeak: false,
      ignoreErrors: true,
      maxListeners: 10,
    }),
  ],
  providers: [
    {
      provide: BambuEventEmitterService,
      useFactory: (
        configService: ConfigService<IBambuEventEmitterConfig>,
        emitter: EventEmitter2
      ) => {
        const logger = new Logger('BambuEventEmitterModule');

        const maxListeners = configService.get('maxListeners');

        // Update the emitter to match the config specified
        logger.debug(`Setting max event listeners to ${maxListeners} `);
        emitter.setMaxListeners(maxListeners);
        logger.log(`Initialising Nest Event Emitter Module`);
        return new BambuEventEmitterService(logger, emitter);
      },
      inject: [ConfigService, EventEmitter2],
    },
  ],
  exports: [NestEventEmitterModule, BambuEventEmitterService],
})
export class BambuEventEmitterModule {}
