import { Drawer, List, Toolbar } from '@bambu/react-ui';
import type { SvgIcon } from '@bambu/react-ui';
import HomeIcon from '@mui/icons-material/Home';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import BrushIcon from '@mui/icons-material/Brush';
import FlagIcon from '@mui/icons-material/Flag';
import SettingsIcon from '@mui/icons-material/Settings';
import TextFieldsIcon from '@mui/icons-material/TextFields';

import AmpStoriesIcon from './AmpStoriesIcon';
import SideNavbarItem from '../SideNavbarItem/SideNavbarItem';

export function SideNavbar() {
  return (
    <Drawer variant="permanent" open>
      <Toolbar />
      <List>
        <SideNavbarItem Icon={HomeIcon} label="Dashboard" path="home" />
        <SideNavbarItem
          Icon={ConnectWithoutContactIcon}
          label="Leads"
          path="leads"
        />
        <SideNavbarItem
          Icon={AmpStoriesIcon as typeof SvgIcon}
          label="Portfolios"
          path="portfolios"
        />
        <SideNavbarItem Icon={BrushIcon} label="Branding" path="branding" />
        <SideNavbarItem Icon={FlagIcon} label="Goals" path="goals" />
        <SideNavbarItem Icon={TextFieldsIcon} label="Content" path="content" />
        <SideNavbarItem Icon={SettingsIcon} label="Settings" path="settings" />
      </List>
    </Drawer>
  );
}

export default SideNavbar;
