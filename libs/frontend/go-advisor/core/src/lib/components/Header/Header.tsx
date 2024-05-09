import { ApplicationHeader as BambuHeader } from '@bambu/react-ui';
import UserMenu from '../UserMenu/UserMenu';
import Logo from './assets/logo.svg';

export function Header() {
  return (
    <BambuHeader
      sx={(theme) => ({
        zIndex: theme.zIndex.drawer + 1,
      })}
      Logo={
        <img src={Logo} alt="logo" width={110} height={28} loading={'lazy'} />
      }
      Actions={<UserMenu />}
    />
  );
}

export default Header;
