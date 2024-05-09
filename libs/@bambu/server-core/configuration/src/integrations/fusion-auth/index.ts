import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';
import { IRestApiIntegrationBaseConfigDto } from '../../dto';

export interface IFusionAuthIntegrationConfigInternalDto
  extends IRestApiIntegrationBaseConfigDto {
  apiKey: string;
  jwtTokenTtlInSeconds: number;
  jwtRefreshTokenTtlInMinutes: number;
  rememberPreviousPasswords: {
    enabled: boolean;
    count: number;
  };
}

export interface IFusionAuthIntegrationConfigDto {
  fusionAuth: IFusionAuthIntegrationConfigInternalDto;
}

export function getFusionAuthConfiguration(): IFusionAuthIntegrationConfigDto {
  const baseUrl: string = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'FUSION_AUTH_BASE_URL',
  });

  const apiKey: string = EnvironmentVariables.getEnvVariableAsString({
    fieldName: 'FUSION_AUTH_ADMIN_API_KEY',
  });

  const jwtTokenTtlInSeconds = EnvironmentVariables.getEnvVariableAsInteger({
    fieldName: 'FUSION_AUTH_JWT_TOKEN_TTL_IN_SECONDS',
    defaultValue: 300,
  });

  const jwtRefreshTokenTtlInMinutes =
    EnvironmentVariables.getEnvVariableAsInteger({
      fieldName: 'FUSION_AUTH_JWT_REFRESH_TOKEN_TTL_IN_MINUTES',
      defaultValue: 1440,
    });

  const rememberPreviousPasswordsEnabled =
    EnvironmentVariables.getEnvVariableAsBoolean({
      fieldName: 'FUSION_AUTH_REMEMBER_PREVIOUS_PASSWORDS_ENABLED',
      defaultValue: 1,
    });

  const rememberPreviousPasswordsCount =
    EnvironmentVariables.getEnvVariableAsInteger({
      fieldName: 'FUSION_AUTH_REMEMBER_PREVIOUS_PASSWORDS_COUNT',
      defaultValue: 3,
    });

  return {
    fusionAuth: {
      baseUrl,
      apiKey,
      jwtTokenTtlInSeconds,
      jwtRefreshTokenTtlInMinutes,
      rememberPreviousPasswords: {
        enabled: rememberPreviousPasswordsEnabled,
        count: rememberPreviousPasswordsCount,
      },
    },
  };
}
