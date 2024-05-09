import { ThemeProvider } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import type { ReactNode } from 'react';

import createMobilePreviewTheme from './createMobilePreviewTheme';

interface MobilePreviewThemeProviderProps {
  children?: ReactNode;
  /**
   * extend the theme object
   */
  theme?: ThemeOptions;
}

/**
 * wrap the component in this to get the mobile preview theme
 */
export const MobilePreviewThemeProvider = ({
  children,
  theme = {},
}: MobilePreviewThemeProviderProps) => {
  const mobilePreviewTheme = createMobilePreviewTheme(theme);

  return <ThemeProvider theme={mobilePreviewTheme}>{children}</ThemeProvider>;
};

export default MobilePreviewThemeProvider;
