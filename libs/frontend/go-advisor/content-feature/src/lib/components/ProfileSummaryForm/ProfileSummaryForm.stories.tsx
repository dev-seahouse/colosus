import type { Meta } from '@storybook/react';
import { ProfileSummaryForm } from './ProfileSummaryForm';

const Story: Meta<typeof ProfileSummaryForm> = {
  component: ProfileSummaryForm,
  title: 'Content/components/ProfileSummaryForm',
};
export default Story;

export const Primary = {
  args: {},
};
