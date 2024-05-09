// noinspection ES6PreferShortImport

import { IColossusTrackingDto } from '@bambu/server-core/dto';
import type { IGetInvestorLeadsPagedResponseDataDto } from '@bambu/server-core/repositories';

export interface IGetLeadInvestorByTenantIdAndEmailParams {
  tracking: IColossusTrackingDto;
  tenantId: string;
  email: string;
}

export interface IConvertLeadToPlatformUserParams {
  tracking: IColossusTrackingDto;
  tenantId: string;
  applicationId: string;
  leadId: string;
  applicationPreferredLanguages: string[];
  email: string;
  password: string;
}

export abstract class InvestorServiceBase {
  abstract GetLeadInvestorByTenantIdAndEmail(
    params: IGetLeadInvestorByTenantIdAndEmailParams
  ): Promise<IGetInvestorLeadsPagedResponseDataDto>;

  /**
   * The user provides a password, upon which they transition to a
   * platform user.
   */
  abstract ConvertLeadToPlatformUser(
    params: IConvertLeadToPlatformUserParams
  ): Promise<void>;
}
