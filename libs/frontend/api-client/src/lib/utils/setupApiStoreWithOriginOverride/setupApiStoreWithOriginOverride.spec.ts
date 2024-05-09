import useApiStore from '../../store/useApiStore';
import setupApiStoreWithOriginOverride from './setupApiStoreWithOriginOverride';

describe('setupApiStoreWithOriginOverride', () => {
  it('should set originOverride in the api store', async () => {
    const originOverride = 'http://fe.localhost:4200';

    await setupApiStoreWithOriginOverride({ originOverride });

    const { originOverride: actualOriginOverride } = useApiStore.getState();

    expect(actualOriginOverride).toBe(originOverride);
  });
});
