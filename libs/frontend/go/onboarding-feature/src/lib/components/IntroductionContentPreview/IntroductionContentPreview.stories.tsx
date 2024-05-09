import type { Meta } from '@storybook/react';
import { IntroductionContentPreview } from './IntroductionContentPreview';

const Story: Meta<typeof IntroductionContentPreview> = {
  component: IntroductionContentPreview,
  title: 'Onboarding/components/IntroductionContentPreview',
};
export default Story;

export const Primary = {
  args: {},
};
