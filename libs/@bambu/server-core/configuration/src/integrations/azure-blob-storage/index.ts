import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';

export interface IAzureBlobStorageIntegrationConfigInternalDto {
  tenantAssets: {
    connString: string;
    containerName: string;
    cdnBaseUrl: string;
  };
  systemAssets: {
    publicBaseUrl: string;
  };
}

export interface IAzureBlobStorageIntegrationConfigDto {
  azureBlobStorage: IAzureBlobStorageIntegrationConfigInternalDto;
}

export function generateCDNUrl(
  filePath: string,
  CDNBaseURL = getAzureBlobStorageConfiguration().azureBlobStorage.tenantAssets
    .cdnBaseUrl
) {
  return CDNBaseURL + filePath;
}

export function getAzureBlobStorageConfiguration(): IAzureBlobStorageIntegrationConfigDto {
  const connString = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'AZURE_STORAGE_CONNECTION_STRING',
  });
  const containerName = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'AZURE_STORAGE_COLOSSUS_CONTAINER_NAME',
    defaultValue: '$web',
  });

  const publicBaseUrl = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'AZURE_STORAGE_PUBLIC_SYSTEM_ASSETS_PUBLIC_BASE_URL',
  });

  const cdnBaseUrl = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'AZURE_STORAGE_ADVISOR_PUBLIC_ASSETS_PUBLIC_BASE_URL',
  });

  return {
    azureBlobStorage: {
      tenantAssets: {
        connString,
        containerName,
        cdnBaseUrl,
      },
      systemAssets: {
        publicBaseUrl,
      },
    },
  };
}
