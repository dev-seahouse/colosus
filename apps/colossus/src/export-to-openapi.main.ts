import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs-extra';

import { swaggerSetup } from './swagger.setup';

import { AppModule } from './app/app.module';

import { default as getConfig } from './config';

const logger = new Logger(path.basename(__filename));

async function exportToOpenapiMain() {
  const config = getConfig();
  const {
    server: { httpPort, logLevel, appName, host },
  } = config;

  const assetsFolder = path.join(__dirname, 'assets');

  await fs.ensureDir(assetsFolder);

  const app = await NestFactory.create(AppModule, {
    logger: [...logLevel],
  });

  const swagger = swaggerSetup(app, host, httpPort, appName);

  await Promise.all([
    fs.writeJSON(path.join(assetsFolder, 'swagger.json'), swagger, {
      spaces: 2,
    }),
    app.close(),
  ]);
}

exportToOpenapiMain()
  .then(() => {
    logger.log('Export of OpenAPI/Swagger done.');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Error while exporting OpenAPI/Swagger docs.', error);
    process.exit(1);
  });
