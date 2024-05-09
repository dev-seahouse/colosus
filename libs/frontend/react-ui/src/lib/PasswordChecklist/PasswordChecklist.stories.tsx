import type { Meta } from '@storybook/react';
import { PasswordChecklist } from './PasswordChecklist';

const Story: Meta<typeof PasswordChecklist> = {
  component: PasswordChecklist,
  title: 'Auth/components/PasswordChecklist',
  argTypes: {
    value: {
      defaultValue: 'Bambu@1234',
    },
  },
};
export default Story;

export const Primary = {
  args: {},
};
