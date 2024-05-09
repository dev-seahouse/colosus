import { ConnectAdvisorDto } from '@bambu/shared';

export class ConnectTenant {
  id: string;
  tenantId: string;
  incomeThreshold: number;
  retireeSavingsThreshold: number;
  contactLink: string | null;
  setupState: ConnectAdvisorDto.IConnectAdvisorProfileInformationSetupStateDto | null;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
