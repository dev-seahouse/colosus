import type { Meta } from '@storybook/react';
import { EducationFlowPage } from './EducationFlowPage';

import CollegeStartYearForm from '../../components/CollegeStartYearForm/CollegeStartYearForm';
import TotalCollegeFeesForm from '../../components/TotalCollegeFeesForm/TotalCollegeFeesForm';
import InvestmentResult from '../../components/InvestmentResult/InvestmentResult';

const Story: Meta<typeof EducationFlowPage> = {
  component: EducationFlowPage,
  title: 'goal-settings/pages/EducationFlowPage',
};
export default Story;

export const CollegeStartYear = {
  args: {
    children: <CollegeStartYearForm />,
  },
};

export const CollegeFees = {
  args: {
    children: <TotalCollegeFeesForm />,
  },
};

export const RetirementInvestmentResult = {
  args: {
    children: <InvestmentResult />,
  },
};
