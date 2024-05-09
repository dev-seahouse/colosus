import { ListItem, ListItemText } from '@bambu/react-ui';
import RiskCapacityQuestionPreviewTrigger from './RiskCapacityQuestionPreviewTrigger';
import type { ReactNode } from 'react';

export interface RiskCapacityQuestionListItemProps {
  label: string;
  previewDescription: string;
  previewComponent: ReactNode;
}

export const RiskCapacityQuestionListItem = ({
  label,
  previewDescription,
  previewComponent,
}: RiskCapacityQuestionListItemProps) => (
  <ListItem
    secondaryAction={
      <RiskCapacityQuestionPreviewTrigger
        previewDescription={previewDescription}
        previewComponent={previewComponent}
      />
    }
  >
    <ListItemText
      primary={label}
      primaryTypographyProps={{
        variant: 'subtitle2',
      }}
    />
  </ListItem>
);

export default RiskCapacityQuestionListItem;
