import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';

export interface IKeycloakFusionAuthSwitchoverConfigInternalDto {
  useLegacyKeycloakForTenantCreation: boolean;
}

export interface IKeycloakFusionAuthSwitchoverConfigDto {
  keycloakFusionAuthSwitchover: IKeycloakFusionAuthSwitchoverConfigInternalDto;
}

export const getKeycloakFusionAuthSwitchoverConfiguration =
  (): IKeycloakFusionAuthSwitchoverConfigDto => {
    const useLegacyKeycloakForTenantCreation: boolean =
      EnvironmentVariables.getEnvVariableAsBoolean({
        fieldName: 'USE_LEGACY_KEYCLOAK_FOR_TENANT_CREATION',
        defaultValue: 0,
      });

    return {
      keycloakFusionAuthSwitchover: {
        useLegacyKeycloakForTenantCreation,
      },
    };
  };
