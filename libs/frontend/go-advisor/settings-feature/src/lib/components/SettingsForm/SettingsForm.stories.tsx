import type { Meta } from '@storybook/react';
import { SettingsForm } from './SettingsForm';

const Story: Meta<typeof SettingsForm> = {
  component: SettingsForm,
  title: 'Settings/components/SettingsForm',
};
export default Story;

export const Primary = {
  args: {},
};
