import { EnvironmentVariables } from '@benjamin-wss/cornerstone-js-utilities';

export interface IOpenPGPConfigInternalDto {
  pgpPublicKeyBase64: string;
  pgpPrivateKeyBase64: string;
  pgpRevocationCertificateBase64: string;
  pgpPassphrase: string;
}

export interface IOpenPGPConfigDto {
  openPGPConfig: IOpenPGPConfigInternalDto;
}

export function getOpenPgpConfiguration(): IOpenPGPConfigDto {
  return {
    openPGPConfig: {
      pgpPassphrase: EnvironmentVariables.getEnvVariableAsString({
        fieldName: 'PGP_PASSPHRASE',
      }),
      pgpPrivateKeyBase64: EnvironmentVariables.getEnvVariableAsString({
        fieldName: 'PGP_PRIVATE_KEY_BASE64',
      }),
      pgpPublicKeyBase64: EnvironmentVariables.getEnvVariableAsString({
        fieldName: 'PGP_PUBLIC_KEY_BASE64',
      }),
      pgpRevocationCertificateBase64:
        EnvironmentVariables.getEnvVariableAsString({
          fieldName: 'PGP_REVOCATION_CERTIFICATE_BASE64',
        }),
    },
  };
}
