import { EditButton, GoAppPreviewDrawer } from '@bambu/go-advisor-core';
import Visibility from '@mui/icons-material/Visibility';
import { useState } from 'react';
import type { ReactNode } from 'react';

export interface RiskCapacityQuestionPreviewTriggerProps {
  previewDescription: string;
  previewComponent: ReactNode;
}

export const RiskCapacityQuestionPreviewTrigger = ({
  previewDescription,
  previewComponent,
}: RiskCapacityQuestionPreviewTriggerProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <EditButton
        onClick={() => setIsDrawerOpen(true)}
        label="Preview"
        icon={<Visibility color="primary" />}
      />
      <GoAppPreviewDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        content={previewDescription}
      >
        {previewComponent}
      </GoAppPreviewDrawer>
    </>
  );
};

export default RiskCapacityQuestionPreviewTrigger;
