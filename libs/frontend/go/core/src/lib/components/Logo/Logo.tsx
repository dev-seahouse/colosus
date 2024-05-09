import { styled, Typography } from '@bambu/react-ui';

import {
  useSelectLogoQuery,
  useSelectPlatformNameQuery,
} from '../../hooks/useGetBranding/useGetBranding.selectors';

const LogoContainer = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  maxWidth: 125,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

const StyledLogo = styled('img')({
  width: 'auto',
  height: '100%',
  objectFit: 'contain',
});

export function Logo({ onClick }: { onClick?: () => void }) {
  const { data: logo } = useSelectLogoQuery();
  const { data: platformName } = useSelectPlatformNameQuery();

  if (logo) {
    return (
      <LogoContainer
        className="logo-container"
        onClick={onClick}
        sx={{ cursor: 'pointer' }}
      >
        <StyledLogo src={logo} alt={`${platformName} logo`} />
      </LogoContainer>
    );
  }

  // TODO: currently if primary color is not accessible, the logo will be invisible
  // find a way to render accessible text against background colors
  return (
    <Typography
      textTransform="uppercase"
      color="primary"
      onClick={onClick}
      sx={{ cursor: 'pointer' }}
    >
      {platformName}
    </Typography>
  );
}

export default Logo;
