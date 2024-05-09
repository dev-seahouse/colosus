// noinspection JSIgnoredPromiseFromCall

import { getDomainFromHost } from '@bambu/shared';
import {
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app/app.module';

import { default as getConfig } from './config';

import { swaggerSetup } from './swagger.setup';

async function bootstrap() {
  const config = getConfig();
  const {
    server: { env, httpPort, logLevel, appName, host, corsOrigin },
  } = config;

  const logger = new Logger(appName);

  logger.log('Initializing via Nest.JS Factory');

  const app = await NestFactory.create(AppModule, {
    logger: [...logLevel],
    rawBody: true,
  });

  // Time of writing of this comment: 2023-07-27
  // See: https://stackoverflow.com/a/60709460
  // though note that that response involves outdated headers;
  // visit the links to figure out which ones are no longer present in latest helmet.
  // feature: true means that the feature is enabled, which e.g. in the case of xPoweredBy
  // means that helmet will strip the X-Powered-By header from the response.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      originAgentCluster: false,
      referrerPolicy: false,
      // strictTransportSecurity: true, is set by default
      // xContentTypeOptions: true, is set by default
      xDnsPrefetchControl: false,
      xDownloadOptions: false,
      /**
       * xFrameOptions: true, is set by default
       *
       * Disabling this to allow for iframe embedding.
       */
      xFrameOptions: false,
      // xPermittedCrossDomainPolicies: true, is set by default
      // xPoweredBy: true, is set by default
      // xXssProtection: true, is set by default
    })
  );

  logger.log('Enabling Nest.JS API versioning via URI.');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  logger.log('Setting Nest.JS API API prefix. Root API excluded.');
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.ALL }],
  });

  logger.log('Enabling Nest.JS API validation pipe.');
  app.useGlobalPipes(new ValidationPipe());

  swaggerSetup(app, host, httpPort, appName);

  app.enableShutdownHooks();

  // This ensures that the entire service does not stop working if there is an
  // error in a handler.
  process.on('uncaughtException', (err, errorType) => {
    logger.error(`${errorType}: ${err.message}\n${err.stack}`);
  });

  app.enableCors(async (req: Request, callback) => {
    // Strip down to just the origin, ignore ports.
    const requestingDomain = getDomainFromHost(req.headers['origin'] || '');
    // Pull in the allowed origins from the env variable
    const whitelist = corsOrigin.reduce((acc, allowedOrigin) => {
      const allowedDomain = getDomainFromHost(allowedOrigin);
      acc[allowedDomain] = true;
      return acc;
    }, {} as Record<string, boolean>);

    // If the origin is allowed, just pickup from the headers, so we don't rebuild
    const origin = whitelist[requestingDomain] ? req.headers['origin'] : '';

    // Set up the cors middleware
    const corsOptions: CorsOptions = {
      credentials: true,
      origin: origin,
    };
    // Let the middleware do its thing
    callback(null, corsOptions);
  });

  await app.listen(httpPort);

  logger.log(`🚀 ${env} Application is running on: ${host}:${httpPort}/`);
}

bootstrap();
