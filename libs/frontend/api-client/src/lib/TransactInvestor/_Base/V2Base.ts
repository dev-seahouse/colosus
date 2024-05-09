import createBambuAxiosInstance from '../../utils/createBambuAxiosInstance/createBambuAxiosInstance';

export class TransactInvestorV2BaseApi {
  constructor(
    protected readonly axios = createBambuAxiosInstance({
      extendedURL: '/api/v2/transact/investor',
      withRequestInterceptors: true,
    })
  ) {}
}

export default TransactInvestorV2BaseApi;
