import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const moduleName = 'OpenApiSwaggerSetup';

export function swaggerSetup(
  app: INestApplication,
  host: string,
  httpPort: number,
  appName: string
) {
  const logger = new Logger(moduleName);

  logger.log(`Setting up Swagger.`);

  const swaggerDefaultServer = `${host}:${httpPort}`;

  logger.log(`Swagger default server is ${swaggerDefaultServer}.`);
  logger.log(`Swagger title is ${appName}`);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .addServer(swaggerDefaultServer)
    .addBearerAuth()
    .setTitle(appName)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/openapi', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  return document;
}
