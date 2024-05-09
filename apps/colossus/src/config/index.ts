import {
  IDefaultServerConfig,
  IRestApiIntegrationBaseConfigDto,
  getBambuApiLibraryConfiguration,
  getDefaultServerConfiguration,
} from '@bambu/server-core/configuration';

export interface IServerConfig {
  server: IDefaultServerConfig;
  integration: {
    bambuApiLib: IRestApiIntegrationBaseConfigDto;
  };
}

export default (): IServerConfig => ({
  integration: {
    bambuApiLib: getBambuApiLibraryConfiguration(),
  },
  server: getDefaultServerConfiguration(),
});
