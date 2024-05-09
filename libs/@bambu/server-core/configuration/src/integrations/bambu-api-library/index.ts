import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';
import { IRestApiIntegrationBaseConfigDto } from '../../dto';

export interface IBambuApiLibraryIntegrationConfigDto
  extends IRestApiIntegrationBaseConfigDto {
  masterApiKeyLibrary: string;
  useBambuMasterLicense: boolean;
}

export interface IClientBambuApiLibraryConfigDto {
  key: string;
}

export function getBambuApiLibraryConfiguration(): IBambuApiLibraryIntegrationConfigDto {
  const baseUrl = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'BAMBU_API_LIBRARY_BASE_URL',
    defaultValue: 'https://api-lib.bambu.life',
  });

  const masterApiKeyLibrary = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'BAMBU_API_LIBRARY_MASTER_KEY',
    defaultValue: 'b05a8321a5bffa78116c58a9',
  });

  const useBambuMasterLicense = EnvironmentVariables.getEnvVariableAsBoolean({
    fieldName: 'BAMBU_API_LIBRARY_USE_MASTER_LICENSE',
    defaultValue: 1,
  });

  return {
    baseUrl,
    masterApiKeyLibrary,
    useBambuMasterLicense,
  };
}
