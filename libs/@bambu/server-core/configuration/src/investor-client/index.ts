import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';

export interface IInvestorClientConfigInternalDto {
  host: string;
  blacklistedSubdomains: string[];
}

export interface IInvestorClientConfigDto {
  investorClient: IInvestorClientConfigInternalDto;
}

export const getInvestorClientConfiguration = (): IInvestorClientConfigDto => {
  const host: string = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'INVESTOR_CLIENT_HOST',
    defaultValue: 'localhost:4200',
  });

  const blacklistedSubdomains: string[] =
    EnvironmentVariables.getEnvironmentVariableAsStringArray({
      fieldName: 'INVESTOR_CLIENT_BLACKLISTED_SUBDOMAINS',
      defaultValue: [
        'admin',
        'admin-dev',
        'admin-staging',
        'admin-uat',
        'admin-prod',
        `investor`,
        'investor-dev',
        'investor-uat',
        'investor-staging',
        'investor-prod',
        'advisor',
        'advisor-dev',
        'advisor-uat',
        'advisor-staging',
        'advisor-prod',
        'prod',
        'staging',
        'uat',
        'dev',
      ],
    });

  return {
    investorClient: {
      host,
      blacklistedSubdomains,
    },
  };
};
