import { List, ListItem, ListItemText, Divider } from '@bambu/react-ui';
import { Fragment } from 'react';
import { LayoutWithProgress } from '@bambu/go-core';
import {
  InvestorAgePage,
  InvestorAnnualIncomePage,
} from '@bambu/go-onboarding-feature';
import {
  RetirementFlowPage,
  SetupContributionForm,
  InvestmentStyleQuestionThree,
  GoalTimeframeForm,
  GrowMyWealthFlowPage,
} from '@bambu/go-goal-settings-feature';
import RiskCapacityQuestionListItem from './RiskCapacityQuestionListItem';
import { RiskCapacityQuesionPreview } from './RiskCapacityQuestionPreview';
import PreviewLayout from './PreviewLayout';

const RISK_CAPACITY_QUESTIONS = [
  {
    label: 'Current income and expenses',
    preview: {
      description: 'Risk capacity question',
      Component: (
        <PreviewLayout>
          <InvestorAnnualIncomePage />
        </PreviewLayout>
      ),
    },
  },
  {
    label: 'Available liquid asset that can be invested',
    preview: {
      description: 'Risk capacity question',
      Component: (
        <PreviewLayout>
          <SetupContributionForm />
        </PreviewLayout>
      ),
    },
  },
  {
    label: 'Goal timeframe',
    preview: {
      description: 'Risk capacity question',
      Component: (
        <GrowMyWealthFlowPage>
          <GoalTimeframeForm />
        </GrowMyWealthFlowPage>
      ),
    },
  },
  {
    label: "Client's age",
    preview: {
      description: 'Risk capacity question',
      Component: (
        <PreviewLayout>
          <RiskCapacityQuesionPreview>
            <InvestorAgePage />
          </RiskCapacityQuesionPreview>
        </PreviewLayout>
      ),
    },
  },
  {
    label: 'Familiarity with investing',
    preview: {
      description: 'Risk capacity question',
      Component: (
        <RetirementFlowPage>
          <RiskCapacityQuesionPreview>
            <InvestmentStyleQuestionThree />
          </RiskCapacityQuesionPreview>
        </RetirementFlowPage>
      ),
    },
  },
];

export const RiskCapacityQuestionList = () => {
  return (
    <List>
      <ListItem>
        <ListItemText
          primary="Topic"
          primaryTypographyProps={{
            sx: {
              fontWeight: 700,
            },
            variant: 'subtitle2',
          }}
        />
      </ListItem>
      <Divider />
      {RISK_CAPACITY_QUESTIONS.map((question, index) => (
        <Fragment key={index}>
          <RiskCapacityQuestionListItem
            label={question.label}
            previewDescription={question.preview.description}
            previewComponent={question.preview.Component}
          />
          {index !== RISK_CAPACITY_QUESTIONS.length - 1 && <Divider />}
        </Fragment>
      ))}
    </List>
  );
};

export default RiskCapacityQuestionList;
