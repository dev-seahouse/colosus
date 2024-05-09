import type { TabPanelProps } from '../TabPanel/TabPanel';
import TabPanel from '../TabPanel/TabPanel';
import { Box, Typography } from '@bambu/react-ui';
import { ErrorLoadingCard } from '@bambu/go-core';
import GoalDetailsTransactionHistory from '../GoalDetailsTransactionHistory/GoalDetailsTransactionHistory';

export function GoalDetailsTabsHistoryPanel({
  index,
  value,
  tabsName,
  goalId,
  ...props
}: TabPanelProps & { goalId: string | undefined }) {
  if (!goalId) {
    console.error('GoalDetailsTabsHistoryPanel: goalId is undefined');
    return <ErrorLoadingCard />;
  }

  return (
    <TabPanel index={index} value={value} tabsName={tabsName} {...props}>
      <Box sx={{ px: 1.2, margin: 'auto' }}>
        <Box pb={3}>
          <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>
            Transaction history
          </Typography>
          <Typography sx={{ fontSize: 12, fontWeight: '300', color: '#000' }}>
            Transactions older than 90 days will appear in your account
            statement.
          </Typography>
        </Box>
        <GoalDetailsTransactionHistory goalId={goalId} />
      </Box>
    </TabPanel>
  );
}

export default GoalDetailsTabsHistoryPanel;
