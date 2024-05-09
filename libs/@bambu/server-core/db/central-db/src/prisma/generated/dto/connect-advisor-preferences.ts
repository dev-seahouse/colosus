import { ConnectAdvisorDto } from '@bambu/shared';

export class ConnectAdvisorPreferences
  implements ConnectAdvisorDto.IConnectAdvisorPreferencesDto
{
  id: string;
  tenantId: string;
  userId: string;
  minimumAnnualIncomeThreshold: number | null;
  minimumRetirementSavingsThreshold: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
