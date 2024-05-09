import createBambuAxiosInstance from '../../utils/createBambuAxiosInstance/createBambuAxiosInstance';

export class TransactInvestorBaseApi {
  constructor(
    protected readonly axios = createBambuAxiosInstance({
      extendedURL: '/api/v1/transact/investor',
      withRequestInterceptors: true,
    })
  ) {}
}

export default TransactInvestorBaseApi;
