import type { Meta } from '@storybook/react';
import { IntroductionPage } from './IntroductionPage';

const Story: Meta<typeof IntroductionPage> = {
  component: IntroductionPage,
  title: 'Onboarding/pages/IntroductionPage',
};
export default Story;

export const Primary = {
  args: {},
};
