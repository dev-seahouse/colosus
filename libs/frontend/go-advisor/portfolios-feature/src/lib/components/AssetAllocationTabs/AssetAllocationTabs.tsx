import { lighten, Tab, Tabs } from '@bambu/react-ui';
import { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import { useSelectIsReadyToConfigureTransactPortfolioQuery } from '@bambu/go-advisor-core';
import TransactAssetAllocationPanel from '../TransactAssetAllocationPanel/TransactAssetAllocationPanel';
import ConnectAssetAllocationPanel from '../ConnectAssetAllocationPanel/ConnectAssetAllocationPanel';

const TABS_NAME = 'asset-allocation';
const TRANSACT_TAB_INDEX = 1;
const CONNECT_TAB_INDEX = 0;
export function AssetAllocationTabs() {
  const {
    data: isReadyToConfigureTransactPortfolio,
    isLoading: isLoadingIsReadyToConfigurePortfolio,
  } = useSelectIsReadyToConfigureTransactPortfolioQuery();

  const [tabName, setTabName] = useState(
    isReadyToConfigureTransactPortfolio ? TRANSACT_TAB_INDEX : CONNECT_TAB_INDEX
  );

  function handleTabChange(event: React.SyntheticEvent, newValue: number) {
    setTabName(newValue);
  }

  if (isLoadingIsReadyToConfigurePortfolio) {
    return null;
  }

  return (
    <section>
      <Tabs
        id={`${TABS_NAME}-tabs`}
        data-testid={`${TABS_NAME}-tabs`}
        variant="fullWidth"
        value={tabName}
        onChange={handleTabChange}
        aria-label={'tabs for portfolio asset allocations'}
        sx={(theme) => ({
          borderBottomBorder: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: lighten(theme.palette.primary.main, 0.9),
        })}
      >
        <Tab
          sx={{ fontWeight: 700 }}
          label="Connect"
          {...a11yProps(CONNECT_TAB_INDEX)}
        />
        <Tab
          sx={{ fontWeight: 700 }}
          icon={isReadyToConfigureTransactPortfolio ? '' : <LockIcon />}
          iconPosition="end"
          label={'Transact'}
          {...a11yProps(TRANSACT_TAB_INDEX)}
        />
      </Tabs>
      <ConnectAssetAllocationPanel
        tabsName={TABS_NAME}
        index={CONNECT_TAB_INDEX}
        value={tabName}
      />
      <TransactAssetAllocationPanel
        tabsName={TABS_NAME}
        index={TRANSACT_TAB_INDEX}
        value={tabName}
      />
    </section>
  );
}

function a11yProps(index: number) {
  return {
    id: `${TABS_NAME}-tab-${index}`,
    'aria-controls': `${TABS_NAME}-tabpanel-${index}`,
  };
}

export default AssetAllocationTabs;
