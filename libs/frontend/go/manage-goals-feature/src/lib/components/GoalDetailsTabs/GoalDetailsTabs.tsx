import { Box, Button, lighten, Tab, Tabs } from '@bambu/react-ui';
import { useState } from 'react';
import GoalDetailsTabsOverviewPanel from '../GoalDetailsTabsOverviewPanel/GoalDetailsTabsOverviewPanel';
import GoalDetailsTabsProductsPanel from '../GoalDetailsTabsProductsPanel/GoalDetailsTabsProductsPanel';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BottomActionLayout,
  hasActiveDirectDebitMandates,
  isKycActive,
  selectHasActiveOrPendingSubscription,
  useGetBrokerageProfileForInvestor,
  useGetDirectDebitMandates,
  useGetDirectDebitSubscriptions,
  useGetInvestorGoalDetails,
} from '@bambu/go-core';
import GoalDetailsTabsHistoryPanel from '../GoalDetailsTabsHistoryPanel/GoalDetailsTabsHistoryPanel';
import { InvestorBrokerageUkDirectDebitSubscriptionStatusEnum } from '@bambu/api-client';
import { GoalStatusEnum } from '@bambu/shared';

const TABS_NAME = 'goal-details';

export function GoalDetailsTabs() {
  const { goalId } = useParams();
  const { data: mandates } = useGetDirectDebitMandates();
  const { data: goal } = useGetInvestorGoalDetails(
    { goalId: goalId ?? '' },
    {
      enabled: !!goalId,
    }
  );
  const { data: platformUsers } = useGetBrokerageProfileForInvestor();
  const { data: hasActiveDirectDebitSubscription } =
    useGetDirectDebitSubscriptions(
      {
        goalId: goalId,
        limit: 1,
        status: InvestorBrokerageUkDirectDebitSubscriptionStatusEnum.ACTIVE,
      },
      {
        enabled: !!goalId && Array.isArray(mandates) && mandates.length > 0,
        select: selectHasActiveOrPendingSubscription,
      }
    );
  const navigate = useNavigate();
  const [tabValue, setTabTabValue] = useState(0);

  function shouldShowFundMyGoalButton(goalStatus: GoalStatusEnum) {
    if (
      !hasActiveDirectDebitMandates(mandates) ||
      !isKycActive(platformUsers)
    ) {
      return false;
    }

    if (hasActiveDirectDebitSubscription) {
      return false;
    }

    return !(
      goalStatus === GoalStatusEnum.ACTIVE ||
      goalStatus === GoalStatusEnum.CREATED
    );
  }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabTabValue(newValue);
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          borderBottomBorder: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: lighten(theme.palette.primary.main, 0.9),
        })}
      >
        <Tabs
          id={`${TABS_NAME}-tabs`}
          data-testid={`${TABS_NAME}-tabs`}
          variant="fullWidth"
          value={tabValue}
          onChange={handleChange}
          aria-label={TABS_NAME}
        >
          <Tab label={'Overview'} {...a11yProps(0)} />
          <Tab label={'Products'} {...a11yProps(1)} />
          <Tab label={'History'} {...a11yProps(2)} />
        </Tabs>
      </Box>
      <GoalDetailsTabsOverviewPanel
        tabsName={TABS_NAME}
        index={0}
        value={tabValue}
        goalId={goalId}
      />
      <GoalDetailsTabsProductsPanel
        tabsName={TABS_NAME}
        index={1}
        value={tabValue}
        goalId={goalId}
      />
      <GoalDetailsTabsHistoryPanel
        tabsName={TABS_NAME}
        index={2}
        value={tabValue}
        goalId={goalId}
      />

      {shouldShowFundMyGoalButton(goal?.status ?? GoalStatusEnum.PENDING) && (
        <BottomActionLayout sx={{ position: 'fixed' }}>
          <Button
            sx={{ width: ['100%', 'auto'], marginLeft: ['', 'auto'] }}
            onClick={() => navigate(`/payment-settings/${goalId}`)}
          >
            Fund My Goal
          </Button>
        </BottomActionLayout>
      )}
    </>
  );
}

function a11yProps(index: number) {
  return {
    id: `${TABS_NAME}-tab-${index}`,
    'aria-controls': `${TABS_NAME}-tabpanel-${index}`,
  };
}

export default GoalDetailsTabs;
