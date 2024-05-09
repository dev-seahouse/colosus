import type { ITenantTransactBrokerageDto } from '@bambu/shared';
import TransactAdvisorBaseApi from '../_Base/Base';

export type TenantTransactBrokerageResponseDto = ITenantTransactBrokerageDto[];

export class TransactAdvisorTenantBrokeragesApi extends TransactAdvisorBaseApi {
  constructor(private readonly apiPath = '/tenant-transact-brokerages') {
    super();
  }

  public async getTenantBrokerages() {
    return this.axios.get<TenantTransactBrokerageResponseDto>(this.apiPath);
  }
}

export default TransactAdvisorTenantBrokeragesApi;
