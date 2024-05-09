import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';
import { ConfigFactoryKeyHost, registerAs } from '@nestjs/config';

export interface IBambuHubspotConfig {
  accessToken: string;
  basePath: string;
  hsSourceProperty: string;
  marketingSubscriptionId?: string;
  pipelineID: string;
  initialPipelineStepID?: string;
  wonPipelineStepId?: string;
  lostPipelineStepId?: string;
  isDisabled: boolean;
}
export const BAMBU_HUBSPOT_MODULE_CONFIG_KEY = 'bambuHubspotConfig';

const { getEnvVariableAsString, getEnvVariableAsBoolean } =
  EnvironmentVariables;

export const getDefaultBambuHubspotConfiguration = (): IBambuHubspotConfig => ({
  basePath: getEnvVariableAsString({
    fieldName: 'HUBSPOT_BASE_PATH',
    defaultValue: 'https://api.hubapi.com',
  }),
  accessToken: getEnvVariableAsString({
    fieldName: 'HUBSPOT_ACCESS_TOKEN',
    defaultValue: '',
  }),
  hsSourceProperty: getEnvVariableAsString({
    fieldName: 'HUBSPOT_SOURCE_PROPERTY',
    defaultValue: 'hs_persona',
  }),
  marketingSubscriptionId: getEnvVariableAsString({
    fieldName: 'HUBSPOT_SUBSCRIPTION_ID',
    defaultValue: '',
  }),
  initialPipelineStepID: getEnvVariableAsString({
    fieldName: 'HUBSPOT_PIPELINE_INITIAL',
    defaultValue: '',
  }),
  wonPipelineStepId: getEnvVariableAsString({
    fieldName: 'HUBSPOT_PIPELINE_WON',
    defaultValue: '',
  }),
  lostPipelineStepId: getEnvVariableAsString({
    fieldName: 'HUBSPOT_PIPELINE_LOST',
    defaultValue: '',
  }),
  pipelineID: getEnvVariableAsString({
    fieldName: 'HUBSPOT_PIPELINE_ID',
    defaultValue: '',
  }),
  isDisabled: getEnvVariableAsBoolean({
    fieldName: 'HUBSPOT_DISABLED',
    defaultValue: 1,
  }),
});

export function getDefaultBambuHubspotConfigurationAsNestJsConfig(): (() => IBambuHubspotConfig) &
  ConfigFactoryKeyHost<ReturnType<() => IBambuHubspotConfig>> {
  return registerAs(
    BAMBU_HUBSPOT_MODULE_CONFIG_KEY,
    getDefaultBambuHubspotConfiguration
  );
}
