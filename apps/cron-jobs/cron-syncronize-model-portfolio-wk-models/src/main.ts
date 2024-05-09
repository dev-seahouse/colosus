import { getDefaultServerConfiguration } from '@bambu/server-core/configuration';
import { JsonUtils } from '@bambu/server-core/utilities';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

async function bootstrap() {
  const logger = new Logger();

  logger.log('Getting basic config.');
  const serverConfig = getDefaultServerConfiguration();

  logger.log('Starting up application and applying log level config.');
  const app = await NestFactory.create(AppModule, {
    logger: serverConfig.logLevel,
  });

  logger.log('Enabling shutdown hooks.');
  app.enableShutdownHooks();

  logger.log('Acquiring CRON instance.');
  const cronService = app.get(AppService);

  try {
    await cronService.Run();
  } catch (error) {
    /**
     * Not throwing error here so K8S pod does not self-destruct.
     */
    logger.error(`Error running cron job: ${JsonUtils.Stringify(error)}`);
  }
}

bootstrap();
