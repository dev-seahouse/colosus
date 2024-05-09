import createBambuAxiosInstance from '../../utils/createBambuAxiosInstance/createBambuAxiosInstance';

/**
 * - Base API class for Connect Advisor private API related classes
 * - This class is responsible for creating an axios instance with the extended Connect Advisor URL
 */
export class ConnectAdvisorBasePrivateApi {
  constructor(
    protected readonly axios = createBambuAxiosInstance({
      extendedURL: '/api/v1/connect/advisor',
      withRequestInterceptors: true,
    })
  ) {}
}

export default ConnectAdvisorBasePrivateApi;
