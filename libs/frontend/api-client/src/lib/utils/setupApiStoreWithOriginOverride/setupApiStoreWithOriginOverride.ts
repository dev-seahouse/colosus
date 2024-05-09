import useApiStore from '../../store/useApiStore';

export interface SetupApiStoreParams {
  originOverride?: string;
}

/**
 * Set up the API store with originOverride, for use in DEV mode only
 */
export const setupApiStoreWithOriginOverride = async ({
  originOverride,
}: SetupApiStoreParams) => {
  useApiStore.setState({ originOverride });
};

export default setupApiStoreWithOriginOverride;
