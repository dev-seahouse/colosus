import defaultAxios from 'axios';

import useApiStore from '../../store/useApiStore';
import createDefaultAxiosInterceptorsRequestConfig from '../createDefaultAxiosInterceptorsRequestConfig/createDefaultAxiosInterceptorsRequestConfig';

export interface CreateBambuAxiosInstanceOptions {
  extendedURL?: string;
  withRequestInterceptors?: boolean;
}

/**
 * returns an axios instance with baseURL currently defined in the api store
 */
export const createBambuAxiosInstance = (
  options: Partial<CreateBambuAxiosInstanceOptions> = {
    extendedURL: '',
    withRequestInterceptors: false,
  }
) => {
  const { baseURL, originOverride } = useApiStore.getState();
  const { extendedURL } = options;

  const axios = defaultAxios.create({
    baseURL: `${baseURL}${extendedURL}`,
    ...(originOverride &&
      originOverride !== '' && {
        headers: { 'origin-override': originOverride },
      }),
  });

  if (options.withRequestInterceptors) {
    axios.interceptors.request.use(createDefaultAxiosInterceptorsRequestConfig);
  }

  return axios;
};

export default createBambuAxiosInstance;
