import { Enums } from '@bambu/server-core/constants';
import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';
import { ConfigFactoryKeyHost, registerAs } from '@nestjs/config';

const {
  getEnvVariableAsString,
  getEnvVariableAsInteger,
  getEnvironmentVariableAsStringArray,
} = EnvironmentVariables;

export interface IDefaultServerConfig {
  appName: string;
  env: string;
  httpPort: number;
  logLevel: Enums.Logging.LogLevelsEnum[];
  host: string;
  corsOrigin: string[];
  connectAdvisorBaseUrl: string;
}

export const getDefaultServerConfiguration = (): IDefaultServerConfig => ({
  appName: getEnvVariableAsString({
    fieldName: 'SERVICE_NAME',
    defaultValue: 'COLOSSUS',
  }),
  env: getEnvVariableAsString({
    fieldName: 'NODE_ENV',
    defaultValue: 'development',
  }),
  httpPort: getEnvVariableAsInteger({
    fieldName: 'HTTP_PORT',
    defaultValue: 9000,
  }),
  logLevel: getEnvironmentVariableAsStringArray({
    fieldName: 'LOG_LEVEL',
    defaultValue: [
      Enums.Logging.LogLevelsEnum.LOG,
      Enums.Logging.LogLevelsEnum.ERROR,
      Enums.Logging.LogLevelsEnum.WARN,
    ],
  }) as Enums.Logging.LogLevelsEnum[],
  host: getEnvVariableAsString({
    fieldName: 'HOST',
    defaultValue: 'http://localhost',
  }),
  corsOrigin: getEnvironmentVariableAsStringArray({
    fieldName: 'CORS_ORIGIN',
    defaultValue: ['http://127.0.0.1:4200', 'http://127.0.0.1:4300'],
  }),
  connectAdvisorBaseUrl: getEnvVariableAsString({
    fieldName: 'CONNECT_ADVISOR_BASE_URL',
    defaultValue: 'http://127.0.0.1:4200',
  }),
});

export function getDefaultServerConfigurationAsNestJsConfig(): (() => IDefaultServerConfig) &
  ConfigFactoryKeyHost<ReturnType<() => IDefaultServerConfig>> {
  return registerAs('defaultServerConfig', getDefaultServerConfiguration);
}
