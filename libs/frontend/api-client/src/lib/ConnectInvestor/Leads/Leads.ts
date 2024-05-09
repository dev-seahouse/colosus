import type { ConnectLeadsDto } from '@bambu/shared';
import ConnectInvestorBaseApi from '../_Base/Base';

export type ConnectInvestorSaveLeadRequestDto =
  ConnectLeadsDto.IConnectLeadsItemDto;

export type ConnectInvestorSaveLeadRequestProjectedReturns =
  ConnectInvestorSaveLeadRequestDto['projectedReturns'];

export class ConnectInvestorLeadsApi extends ConnectInvestorBaseApi {
  constructor(private readonly apiPath = '/leads') {
    super();
  }

  public async saveLead(req: ConnectInvestorSaveLeadRequestDto) {
    return this.axios.post(this.apiPath, req);
  }
}

export default ConnectInvestorLeadsApi;
