import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';

export interface ITransactInvestorSwitchoverConfigInternalDto {
  useLegacyTransactForInvestorCreation: boolean;
}

export interface ITransactInvestorSwitchoverConfigDto {
  transactInvestorSwitchover: ITransactInvestorSwitchoverConfigInternalDto;
}

export function getTransactInvestorSwitchoverConfiguration(): ITransactInvestorSwitchoverConfigDto {
  const useLegacyTransactForInvestorCreation: boolean =
    EnvironmentVariables.getEnvVariableAsBoolean({
      fieldName: 'USE_LEGACY_TRANSACT_FOR_INVESTOR_CREATION',
      defaultValue: 1,
    });

  return {
    transactInvestorSwitchover: {
      useLegacyTransactForInvestorCreation,
    },
  };
}
