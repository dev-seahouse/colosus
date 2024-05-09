import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';
import { IRestApiIntegrationBaseConfigDto } from '../../dto';

export interface IKeycloakIntegrationConfigInternalDto
  extends IRestApiIntegrationBaseConfigDto {
  baseUrl: string;
  adminUsername: string;
  adminPassword: string;
  publicRealm: string;
  publicUserUsername: string;
  publicUserPassword: string;
}

export interface IKeycloakIntegrationConfigDto {
  keycloak: IKeycloakIntegrationConfigInternalDto;
}

export function getKeycloakConfiguration(): IKeycloakIntegrationConfigDto {
  const baseUrl = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'KEYCLOAK_BASE_URL',
    defaultValue: 'https://keycloak:8080',
  });
  const adminUsername = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'KEYCLOAK_ADMIN_USERNAME',
    defaultValue: 'admin',
  });
  const adminPassword = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'KEYCLOAK_ADMIN_PASSWORD',
    defaultValue: 'admin',
  });
  const publicRealm = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'KEYCLOAK_PUBLIC_REALM',
    defaultValue: 'colossus-public',
  });
  const publicUserUsername = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'KEYCLOAK_PUBLIC_USER_USERNAME',
    defaultValue: 'publicuser',
  });
  const publicUserPassword = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'KEYCLOAK_PUBLIC_USER_PASSWORD',
    defaultValue: 'publicuser',
  });

  return {
    keycloak: {
      baseUrl,
      adminUsername,
      adminPassword,
      publicRealm,
      publicUserUsername,
      publicUserPassword,
    },
  };
}
