import createBambuAxiosInstance from '../../utils/createBambuAxiosInstance/createBambuAxiosInstance';

/**
 * - Base API class for Tenant private API related classes
 * - This class is responsible for creating an axios instance with the extended Tenant URL
 */
export class TenantBasePrivateApi {
  constructor(
    protected readonly axios = createBambuAxiosInstance({
      extendedURL: '/api/v1/tenant',
      withRequestInterceptors: true,
    })
  ) {}
}

export default TenantBasePrivateApi;
