import type { ConnectLeadsDto, IGenericDataSummaryDto } from '@bambu/shared';
import ConnectAdvisorBasePrivateApi from '../_Base/Base';
import { SharedEnums } from '@bambu/shared';

export const LEADS_TYPES = SharedEnums.LeadsEnums.EnumLeadsQualifiedFilter;

export type TLeadsTypes = SharedEnums.LeadsEnums.EnumLeadsQualifiedFilter;

export const LEADS_STATUS_TYPES = SharedEnums.LeadsEnums.EnumLeadStatus; // NEW | REVIEWED
export type TLeadsStatusTypes = keyof typeof LEADS_STATUS_TYPES;

export type TLeadsCount = {
  [key in keyof typeof LEADS_TYPES]: number | void;
};

export type TLeadsItem = ConnectLeadsDto.IConnectLeadsAdvisorDto;

export type ConnectAdvisorGetLeadsResponseDto =
  ConnectLeadsDto.IConnectLeadsDto;

export type ConnectAdvisorGetLeadsRequestDto =
  ConnectLeadsDto.IConnectAdvisorLeadsApiRequestDto;

export type GetLeadsSummaryByIdType = {
  id: string;
};

export type ConnectAdvisorUpdateLeadsSummaryStatusDto =
  GetLeadsSummaryByIdType & { status: TLeadsStatusTypes };

export class ConnectAdvisorLeadsApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = 'leads') {
    super();
  }

  /**
   * Returns paginated list of leads for a tenant..
   * - {@link http://localhost:9000/openapi#/Connect%20Advisor/GetLeads}.
   */
  public async getLeads(req: ConnectAdvisorGetLeadsRequestDto) {
    return await this.axios.post<ConnectAdvisorGetLeadsResponseDto>(
      `${this.apiPath}`,
      req
    );
  }

  /**
   * Returns leads summary for selected uuid
   * -{@link http://localhost:9000/openapi#/Connect%20Advisor/ConnectAdvisorController_GetLeadSummaryByLeadId}
   */
  public async getLeadsSummaryById(req: GetLeadsSummaryByIdType) {
    return await this.axios.get<IGenericDataSummaryDto[]>(
      `${this.apiPath}/${req.id}/summary`
    );
  }

  /**
   * Update leads summary status by id
   * -{@link http://localhost:9000/openapi#/Connect%20Advisor/ConnectAdvisorController_UpdateLeadById}
   *
   */
  public async updateLeadsStatus(
    req: ConnectAdvisorUpdateLeadsSummaryStatusDto
  ) {
    return await this.axios.patch<ConnectAdvisorGetLeadsResponseDto>(
      `${this.apiPath}/${req.id}`,
      {
        status: req.status,
      }
    );
  }
}

export default ConnectAdvisorLeadsApi;
