import { ApplicationHeader as BambuHeader } from '@bambu/react-ui';

import Logo from '../Logo/Logo';
import UserMenu from '../UserMenu/UserMenu';
import { useNavigate } from 'react-router-dom';
import { useSelectIsUserLoggedIn } from '../../store/useCoreStore.selectors';

export function Header() {
  const navigate = useNavigate();
  const isUserLoggedIn = useSelectIsUserLoggedIn();

  function handleLogoClick() {
    if (isUserLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }

  return (
    <BambuHeader
      Logo={<Logo onClick={handleLogoClick} />}
      Actions={<UserMenu />}
    />
  );
}

export default Header;
