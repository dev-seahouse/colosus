import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';

export interface IFileUploadConfigInternalDto {
  tmpFileDir: string;
}

export interface IFileUploadConfigDto {
  fileUpload: IFileUploadConfigInternalDto;
}

export function getDefaultFileUploadConfiguration(): IFileUploadConfigDto {
  const tmpFileDir = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'TEMPORARY_FILE_DIRECTORY',
  });

  return {
    fileUpload: {
      tmpFileDir,
    },
  };
}
