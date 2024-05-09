import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';
import { ConfigFactoryKeyHost, registerAs } from '@nestjs/config';

export interface IBambuEmailerConfig {
  defaultTransport: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
    fromEmailAddress: string;
  };
}

export const BAMBU_EMAILER_MODULE_CONFIG_KEY = 'bambuEmailerModuleConfig';

const {
  getEnvVariableAsInteger,
  getEnvVariableAsBoolean,
  getEnvVariableAsString,
} = EnvironmentVariables;

export const getDefaultBambuEmailerConfiguration = (): IBambuEmailerConfig => ({
  defaultTransport: {
    host: getEnvVariableAsString({
      fieldName: 'MAIL_TRANSPORT_HOST',
    }),
    port: getEnvVariableAsInteger({
      fieldName: 'MAIL_TRANSPORT_PORT',
    }),
    secure: getEnvVariableAsBoolean({
      fieldName: 'MAIL_TRANSPORT_SECURE',
    }),
    username: getEnvVariableAsString({
      fieldName: 'MAIL_TRANSPORT_USERNAME',
    }),
    password: getEnvVariableAsString({
      fieldName: 'MAIL_TRANSPORT_PASSWORD',
    }),
    fromEmailAddress: getEnvVariableAsString({
      fieldName: 'MAIL_TRANSPORT_FROM_ADDRESS',
      defaultValue: 'no-reply@go-bambu.co',
    }),
  },
});

export function getDefaultBambuEmailerConfigurationAsNestJsConfig(): (() => IBambuEmailerConfig) &
  ConfigFactoryKeyHost<ReturnType<() => IBambuEmailerConfig>> {
  return registerAs(
    BAMBU_EMAILER_MODULE_CONFIG_KEY,
    getDefaultBambuEmailerConfiguration
  );
}
