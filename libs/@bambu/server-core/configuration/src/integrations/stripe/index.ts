import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';

export interface IStripeIntegrationConfigDto {
  apiVersion: string;
  secretKey: string;
  webhookEndpointSecret: string;
}

const { getEnvVariableAsString } = EnvironmentVariables;

const config: IStripeIntegrationConfigDto = {
  apiVersion: getEnvVariableAsString({
    fieldName: 'STRIPE_API_VERSION',
    defaultValue: '2022-11-15',
  }),
  secretKey: getEnvVariableAsString({
    fieldName: 'STRIPE_SECRET_KEY',
  }),
  webhookEndpointSecret: getEnvVariableAsString({
    fieldName: 'STRIPE_WEBHOOK_ENDPOINT_SECRET',
  }),
};

Object.freeze(config);

export const getStripeIntegrationConfiguration =
  (): IStripeIntegrationConfigDto => ({
    ...config,
  });
