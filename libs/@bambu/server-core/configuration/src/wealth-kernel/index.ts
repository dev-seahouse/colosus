import { Enums } from '@bambu/server-core/constants';
import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';

export interface IWealthKernelConnectorConfigInternalDto {
  appName: string;
  env: string;
  httpPort: number;
  logLevel: Enums.Logging.LogLevelsEnum[];
  host: string;
  apiPrefix: string;
  baseUrl: string;
}

export interface IWealthKernelConfigDto {
  wealthKernelConfig: {
    connector: IWealthKernelConnectorConfigInternalDto;
    authApiBaseUrl: string;
    opsApiBaseUrl: string;
    apiVersionHeader: string;
  };
}

export interface IWealthKernelEmailsConfigDto {
  wealthKernelEmailsConfig: {
    wkTenantsEmailAddress: string;
    wkInvestmentsEmailAddress: string;
  };
}

const {
  getEnvVariableAsString,
  getEnvVariableAsInteger,
  getEnvironmentVariableAsStringArray,
} = EnvironmentVariables;

export function getWealthKernelConfiguration(): IWealthKernelConfigDto {
  const result: IWealthKernelConfigDto = {
    wealthKernelConfig: {
      connector: {
        appName: getEnvVariableAsString({
          fieldName: 'WEALTH_KERNEL_CONNECTOR_NAME',
          defaultValue: 'COLOSSUS WEALTH KERNEL CONNECTOR',
        }),
        env: getEnvVariableAsString({
          fieldName: 'NODE_ENV',
          defaultValue: 'development',
        }),
        httpPort: getEnvVariableAsInteger({
          fieldName: 'WEALTH_KERNEL_CONNECTOR_HTTP_PORT',
          defaultValue: 9001,
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
          fieldName: 'WEALTH_KERNEL_CONNECTOR_HOST',
          defaultValue: 'http://localhost',
        }),
        apiPrefix: getEnvVariableAsString({
          fieldName: 'WEALTH_KERNEL_CONNECTOR_API_PREFIX',
          defaultValue: 'api',
        }),
        baseUrl: '',
      },
      authApiBaseUrl: getEnvVariableAsString({
        fieldName: 'WEALTH_KERNEL_AUTH_API_BASE_URL',
      }),
      opsApiBaseUrl: getEnvVariableAsString({
        fieldName: 'WEALTH_KERNEL_OPS_API_BASE_URL',
      }),
      apiVersionHeader: getEnvVariableAsString({
        fieldName: 'WEALTH_KERNEL_API_VERSION_HEADER',
        defaultValue: '2021-05-17',
      }),
    },
  };

  result.wealthKernelConfig.connector.baseUrl = [
    result.wealthKernelConfig.connector.host,
    ':',
    result.wealthKernelConfig.connector.httpPort,
    '/',
    result.wealthKernelConfig.connector.apiPrefix,
  ].join('');

  return result;
}

export function getWealthKernelEmailsConfiguration(): IWealthKernelEmailsConfigDto {
  return {
    wealthKernelEmailsConfig: {
      wkTenantsEmailAddress: getEnvVariableAsString({
        fieldName: 'WEALTH_KERNEL_TENANTS_EMAIL_ADDRESS',
        defaultValue: 'tenants@wealthkernel.com',
      }),
      wkInvestmentsEmailAddress: getEnvVariableAsString({
        fieldName: 'WEALTH_KERNEL_INVESTMENTS_EMAIL_ADDRESS',
        defaultValue: 'investments@wealthkernel.com',
      }),
    },
  };
}
