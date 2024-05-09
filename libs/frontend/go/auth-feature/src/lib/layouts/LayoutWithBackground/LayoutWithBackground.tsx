import { styled } from '@bambu/react-ui';
import { Box } from '@bambu/react-ui';
import { transformColorToMatch } from '@bambu/go-core';

/**
 * Layout With Background
 * layout component to wrap children with a background derived from theme.palette.primary
 * and derive the background color from the primary color
 * uses mui box component, accepts all props from box
 *
 * Note the following properties
 * -  height 100vh
 * -  width 100vw
 * -  position absolute (to take it out of the flow and avoid overflow issues)
 */

export const LayoutWithBackground = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  position: 'absolute',
  background: transformColorToMatch(theme.palette.primary.main),
}));
export default LayoutWithBackground;
