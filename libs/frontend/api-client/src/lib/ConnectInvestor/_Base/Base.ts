import createBambuAxiosInstance from '../../utils/createBambuAxiosInstance/createBambuAxiosInstance';

/**
 * - Base API class for Connect Investor API related classes
 * - This class is responsible for creating an axios instance with the extended Connect Investor URL
 */
export class ConnectInvestorBaseApi {
  constructor(
    protected readonly axios = createBambuAxiosInstance({
      extendedURL: '/api/v1/connect/investor',
    })
  ) {}
}

export default ConnectInvestorBaseApi;
