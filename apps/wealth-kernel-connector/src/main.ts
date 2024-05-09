import {
  getWealthKernelConfiguration,
  IWealthKernelConfigDto,
} from '@bambu/server-core/configuration';
import {
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { API_TAGS } from './constants';

async function bootstrap() {
  const logger = new Logger();

  const serverConfig: IWealthKernelConfigDto = getWealthKernelConfiguration();

  const {
    wealthKernelConfig: {
      connector: { appName, logLevel, baseUrl, httpPort, env, host, apiPrefix },
    },
  } = serverConfig;

  logger.log('Initializing via Nest.JS Factory');
  const app = await NestFactory.create(AppModule, {
    logger: [...logLevel],
    rawBody: true,
  });

  logger.log('Enabling Nest.JS API versioning via URI.');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  logger.log('Setting Nest.JS API API prefix. Root API excluded.');
  app.setGlobalPrefix(apiPrefix, {
    exclude: [{ path: '', method: RequestMethod.ALL }],
  });

  logger.log('Enabling Nest.JS API validation pipe.');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  logger.log(`Setting up Swagger.`);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .addServer(`${host}:${httpPort}`, 'Local Development')
    .addBearerAuth()
    .setTitle(appName)
    .setDescription(
      'Wealth Kernel Connector API. DO NOT EXPOSE TO PUBLIC INTERNET!!'
    )
    .addTag(API_TAGS.ADDRESSES.name, API_TAGS.ADDRESSES.description)
    .addTag(API_TAGS.BANK_ACCOUNTS.name, API_TAGS.BANK_ACCOUNTS.description)
    .addTag(API_TAGS.ACCOUNTS.name, API_TAGS.ACCOUNTS.description)
    .addTag(API_TAGS.PORTFOLIOS.name, API_TAGS.PORTFOLIOS.description)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/open-api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  app.enableShutdownHooks();

  // This ensures that the entire service does not stop working if there is an
  // error in a handler.
  process.on('uncaughtException', (err, errorType) => {
    logger.error(`${errorType}: ${err.message}\n${err.stack}`);
  });

  await app.listen(httpPort);
  logger.log(`🚀 Application is running on: ${baseUrl}. NODE_ENV: ${env}.`);
}

bootstrap();
