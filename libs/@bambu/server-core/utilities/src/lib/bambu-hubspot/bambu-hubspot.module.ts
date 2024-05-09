import {
  getDefaultBambuHubspotConfiguration,
  IBambuHubspotConfig,
} from '@bambu/server-core/configuration';
import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BambuEventEmitterService } from '../bambu-event-emitter';
import { BambuHubspotService } from './bambu-hubspot.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(getDefaultBambuHubspotConfiguration)],
  exports: [BambuHubspotService],
  providers: [
    {
      provide: BambuHubspotService,
      useFactory: (
        configService: ConfigService,
        eventEmitterService: BambuEventEmitterService
      ) => {
        const accessToken: IBambuHubspotConfig['accessToken'] =
          configService.get<IBambuHubspotConfig['accessToken']>(
            'accessToken'
          ) || '';

        const basePath =
          configService.get<IBambuHubspotConfig['basePath']>('basePath');

        const hsSourceProperty =
          configService.get<IBambuHubspotConfig['hsSourceProperty']>(
            'hsSourceProperty'
          );

        const marketingSubscriptionId = configService.get<
          IBambuHubspotConfig['marketingSubscriptionId']
        >('marketingSubscriptionId');

        const initialPipelineStepId = configService.get<
          IBambuHubspotConfig['initialPipelineStepID']
        >('initialPipelineStepID');

        const wonPipelineStepId =
          configService.get<IBambuHubspotConfig['wonPipelineStepId']>(
            'wonPipelineStepId'
          );

        const lostPipelineStepId =
          configService.get<IBambuHubspotConfig['lostPipelineStepId']>(
            'lostPipelineStepId'
          );

        const pipelineId =
          configService.get<IBambuHubspotConfig['pipelineID']>('pipelineID');

        const isDisabled =
          configService.getOrThrow<IBambuHubspotConfig['isDisabled']>(
            'isDisabled'
          );

        const logger = new Logger('BambuHubspotModule');

        logger.log(`Initialising Hubspot Module`);

        return new BambuHubspotService(
          {
            accessToken: accessToken || '',
            basePath: basePath || '',
            hsSourceProperty: hsSourceProperty || 'hs_persona',
            marketingSubscriptionId: marketingSubscriptionId || '',
            pipelineID: pipelineId || 'default',
            initialPipelineStepId: initialPipelineStepId || '',
            wonPipelineStepId: wonPipelineStepId || '',
            lostPipelineStepId: lostPipelineStepId || '',
            isDisabled,
          },
          logger,
          eventEmitterService
        );
      },
      inject: [ConfigService, BambuEventEmitterService],
    },
  ],
})
export class BambuHubspotModule {}
