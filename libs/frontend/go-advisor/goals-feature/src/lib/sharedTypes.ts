import type { FieldValues } from 'react-hook-form';
import type { ConnectAdvisorGetGoalTypesResponseDto } from '@bambu/api-client';

export interface ConfigureGoalsFormFields extends FieldValues {
  goalTypes: ReadonlyArray<AdvisorGoalTypes>;
}

export type AdvisorGoalTypes =
  ConnectAdvisorGetGoalTypesResponseDto['goalTypes'][number];
