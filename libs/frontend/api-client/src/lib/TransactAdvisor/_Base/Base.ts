import createBambuAxiosInstance from '../../utils/createBambuAxiosInstance/createBambuAxiosInstance';

export class TransactAdvisorBaseApi {
  constructor(
    protected readonly axios = createBambuAxiosInstance({
      extendedURL: '/api/v1/transact/advisor',
      withRequestInterceptors: true,
    })
  ) {}
}

export default TransactAdvisorBaseApi;
