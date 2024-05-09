import { Drawer, List, Toolbar } from '@bambu/react-ui';
import type { SvgIcon } from '@bambu/react-ui';
import HomeIcon from '@mui/icons-material/Home';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SpeedIcon from '@mui/icons-material/Speed';
import BrushIcon from '@mui/icons-material/Brush';
import FlagIcon from '@mui/icons-material/Flag';
import SettingsIcon from '@mui/icons-material/Settings';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { SwitchAccount } from '@mui/icons-material';
import { useFeatureFlags } from '@harnessio/ff-react-client-sdk';
import { NestedNavBarItem } from '../NestedNavBarItem/NestedNavBarItem';
import AmpStoriesIcon from './AmpStoriesIcon';
import SideNavbarItem from '../SideNavbarItem/SideNavbarItem';
import {
  useSelectHasActiveSubscriptionQuery,
  useSelectUnfinishedTaskIndexQuery,
} from '../../hooks/useProfileDetails/useProfileDetails.selectors';
import { useSelectUserSubscriptionType } from '../../store/useCoreStore.selectors';

export const NAVBAR_ICON = {
  LEADS: ConnectWithoutContactIcon,
  RISK_PROFILES: SpeedIcon,
  PORTFOLIOS: AmpStoriesIcon,
  BRANDING: BrushIcon,
  GOALS: FlagIcon,
  CONTENT: TextFieldsIcon,
  GET_VERIFIED: HowToRegIcon,
  SETTINGS: SettingsIcon,
  CLIENTS: SwitchAccount,
};

const RISK_PROFILES_OPTIONS = [
  { label: 'Risk Profile Config.', path: 'risk-profile/config' },
  { label: 'Risk Questionnaire', path: 'risk-profile/questionnaire' },
];

export function SideNavbar() {
  const flags = useFeatureFlags(['feature_settings', 'feature_risk_profile']);
  const { data: userHasActiveSubscription } =
    useSelectHasActiveSubscriptionQuery();
  const subscriptionType = useSelectUserSubscriptionType();
  const hasCompletedAllTasks = useSelectUnfinishedTaskIndexQuery() === -1;
  return (
    <Drawer
      variant="permanent"
      open
      PaperProps={{
        sx: {
          backgroundColor: '#191C1B',
          width: 256,
        },
      }}
    >
      <Toolbar />
      <List>
        <SideNavbarItem Icon={HomeIcon} label="Dashboard" path="home" />
        {userHasActiveSubscription && subscriptionType === 'TRANSACT' ? (
          <SideNavbarItem
            Icon={NAVBAR_ICON.CLIENTS}
            label="Clients"
            path="clients"
          />
        ) : null}
        <SideNavbarItem Icon={NAVBAR_ICON.LEADS} label="Leads" path="leads" />
        {'feature_risk_profile' in flags && flags.feature_risk_profile ? (
          <NestedNavBarItem
            label="Risk Profiles"
            Icon={NAVBAR_ICON.RISK_PROFILES as typeof SvgIcon}
          >
            {RISK_PROFILES_OPTIONS.map((risk) => (
              <SideNavbarItem
                key={risk.label}
                label={risk.label}
                path={risk.path}
              />
            ))}
          </NestedNavBarItem>
        ) : null}

        <SideNavbarItem
          Icon={AmpStoriesIcon as typeof SvgIcon}
          label="Portfolios"
          path="portfolios"
        />
        <SideNavbarItem
          Icon={NAVBAR_ICON.BRANDING}
          label="Branding"
          path="branding"
        />
        <SideNavbarItem Icon={NAVBAR_ICON.GOALS} label="Goals" path="goals" />
        <SideNavbarItem
          Icon={NAVBAR_ICON.CONTENT}
          label="Content"
          path="content"
        />
        {userHasActiveSubscription ? (
          <SideNavbarItem
            Icon={NAVBAR_ICON.GET_VERIFIED}
            label="Get Verified"
            path="get-verified"
          />
        ) : null}
        {'feature_settings' in flags &&
        flags.feature_settings &&
        userHasActiveSubscription &&
        hasCompletedAllTasks ? (
          <SideNavbarItem
            Icon={NAVBAR_ICON.SETTINGS}
            label="Settings"
            path="settings"
          />
        ) : null}
      </List>
    </Drawer>
  );
}

export default SideNavbar;
