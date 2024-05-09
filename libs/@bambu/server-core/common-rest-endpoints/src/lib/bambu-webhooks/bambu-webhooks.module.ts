import { Controller, DynamicModule, Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  getDefaultBambuWebhooksConfiguration,
  IBambuWebhooksConfig,
} from '@bambu/server-core/configuration';
import { BambuWebhooksController } from './bambu-webhooks.controller';
import { BambuWebhooksService } from './bambu-webhooks.service';

@Global()
@Module({
  providers: [BambuWebhooksService],
  exports: [BambuWebhooksService],
})
export class BambuWebhooksModule {
  static forRoot(options: IBambuWebhooksConfig): DynamicModule {
    @Controller(options.path || 'webhooks')
    class WebhooksControllerWrapper extends BambuWebhooksController {}

    return {
      module: BambuWebhooksModule,
      imports: [ConfigModule.forFeature(getDefaultBambuWebhooksConfiguration)],
      controllers: [WebhooksControllerWrapper],
      providers: [BambuWebhooksService],
    };
  }
}
