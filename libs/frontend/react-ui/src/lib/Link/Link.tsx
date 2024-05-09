import MuiLink from '@mui/material/Link';
import { Link as ReactRouterLink } from 'react-router-dom';

import type { LinkProps as MuiLinkProps } from '@mui/material/Link';
import type { LinkProps as ReactRouterLinkProps } from 'react-router-dom';

export type LinkProps = MuiLinkProps &
  Pick<ReactRouterLinkProps, 'to' | 'replace'>;

/**
 *  material-ui Link component that wraps react-router-dom Link component
 */
export function Link(props: LinkProps) {
  return <MuiLink {...props} component={ReactRouterLink} />;
}

export default Link;
