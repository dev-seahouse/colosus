import useApiStore from '../../store/useApiStore';
import createBambuAxiosInstance from './createBambuAxiosInstance';

describe('createBambuAxiosInstance', () => {
  it('should return an axios instance with the baseURL defined in api store', () => {
    const instance = createBambuAxiosInstance();
    expect(instance.defaults.baseURL).toEqual('http://localhost:9000');
  });

  it('should return an axios instance with extended URL if extendedURL is passed as options', () => {
    const instance = createBambuAxiosInstance({
      extendedURL: '/api',
    });
    expect(instance.defaults.baseURL).toEqual('http://localhost:9000/api');
  });

  it('should return an axios instance with originOverride header if originOverride is defined in api store', () => {
    useApiStore.setState({ originOverride: 'fe.localhost:4200' });

    const instance = createBambuAxiosInstance();
    expect(instance.defaults.headers['origin-override']).toEqual(
      'fe.localhost:4200'
    );
  });
});
