import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import type { AppBarProps } from '@mui/material/AppBar';

export type HeaderProps = AppBarProps;

export function Header({ children, ...rest }: HeaderProps) {
  return (
    <AppBar {...rest}>
      <Toolbar>{children}</Toolbar>
    </AppBar>
  );
}

export default Header;
