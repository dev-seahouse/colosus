import type { z } from 'zod';
import type openAccountFormSchema from './OpenInvestAccountForm.schema';
import type { PANEL_ID } from './OpenInvestAccountForm.definition';

export interface OpenInvestAccountFormSectionProps {
  // indicates whether current section is expanded
  isExpanded: boolean;
  // react set state function to set expanded  panel Id, or false if panel is collapsed
  setExpandedPanelId: (section: PANEL_ID_TYPE | false) => void;
  // RHF control
}

export type OpenAccountFormValues = z.infer<typeof openAccountFormSchema>;

export type PANEL_ID_TYPE = (typeof PANEL_ID)[keyof typeof PANEL_ID];
