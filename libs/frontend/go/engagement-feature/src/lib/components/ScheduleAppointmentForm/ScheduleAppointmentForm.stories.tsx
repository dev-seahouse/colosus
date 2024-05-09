import type { Meta } from '@storybook/react';
import { ScheduleAppointmentForm } from './ScheduleAppointmentForm';

const Story: Meta<typeof ScheduleAppointmentForm> = {
  component: ScheduleAppointmentForm,
  title: 'Engagement/components/ScheduleAppointmentForm',
};
export default Story;

export const Primary = {
  args: {},
};
