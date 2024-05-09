import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';
import { ConfigFactoryKeyHost, registerAs } from '@nestjs/config';

export interface IBambuWebhooksConfig {
  // The path for the webhooks controller
  path?: string;
}
export const BAMBU_WEBHOOKS_CONFIG_KEY = 'bambuWebhooksModuleConfig';

const { getEnvVariableAsString } = EnvironmentVariables;

export const getDefaultBambuWebhooksConfiguration =
  (): IBambuWebhooksConfig => ({
    path: getEnvVariableAsString({
      fieldName: 'WEBHOOKS_PATH',
      defaultValue: 'webhooks',
    }),
  });

export function getDefaultBambuWebhooksConfigurationAsNestJsConfig(): (() => IBambuWebhooksConfig) &
  ConfigFactoryKeyHost<ReturnType<() => IBambuWebhooksConfig>> {
  return registerAs(
    BAMBU_WEBHOOKS_CONFIG_KEY,
    getDefaultBambuWebhooksConfiguration
  );
}
