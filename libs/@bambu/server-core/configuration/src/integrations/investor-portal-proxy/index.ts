import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';

export interface IInvestorPortalProxyConfigDto {
  investorConfig: {
    baseUrl: string;
  };
}

export function getInvestorPortalProxyConfig() {
  const config: IInvestorPortalProxyConfigDto = {
    investorConfig: {
      baseUrl: EnvironmentVariables.getEnvVariableAsString({
        fieldName: 'INVESTOR_PORTAL_PROXY_BASE_URL',
      }),
    },
  };

  Object.freeze(config);

  return config;
}
