import {
  IDefaultServerConfig,
  getDefaultServerConfiguration,
} from '@bambu/server-core/configuration';

const serverConfig: IDefaultServerConfig = getDefaultServerConfiguration();

export interface IDbRepositoryConfig {
  serviceUser: string;
}

const config: IDbRepositoryConfig = {
  serviceUser: serverConfig.appName,
};

Object.freeze(config);

export const getDbRepositoryConfig = (): IDbRepositoryConfig => ({ ...config });
