import type { TabPanelProps } from '../TabPanel/TabPanel';
import TabPanel from '../TabPanel/TabPanel';
import GoalSummaryCard from '../GoalSummaryCard/GoalSummaryCard';

export function GoalDetailsTabsOverviewPanel({
  index,
  value,
  tabsName,
  goalId,
  ...props
}: TabPanelProps & { goalId: string | undefined }) {
  return (
    <TabPanel index={index} value={value} tabsName={tabsName} {...props}>
      <GoalSummaryCard isInitialOpen={true} goalId={goalId} />
    </TabPanel>
  );
}

export default GoalDetailsTabsOverviewPanel;
