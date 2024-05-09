import type { ThemeOptions } from '@bambu/react-ui';
import { alpha, createBambuTheme } from '@bambu/react-ui';
import { deepmerge } from '@mui/utils';
import type { GetBrandingData } from '../../hooks/useGetBranding/useGetBranding';

const GO_THEME: ThemeOptions = {
  components: {
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.common.white,
          '&.Mui-expanded': {
            backgroundColor: theme.palette.common.white,
          },
        }),
        expandIconWrapper: ({ theme }) => ({
          color: theme.palette.primary.main,
          '&.Mui-expanded': {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'large',
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: 'bold',
          textTransform: 'capitalize',
        }),
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'md',
      },
      styleOverrides: {
        root: ({ theme }) => ({
          paddingLeft: '5rem',
          paddingRight: '5rem',
          paddingTop: '4rem',
          [theme.breakpoints.down('md')]: {
            paddingLeft: '2rem',
            paddingRight: '2rem',
            paddingTop: '1.5rem',
          },
        }),
        disableGutters: ({ theme }) => ({
          paddingLeft: 0,
          paddingRight: 0,
          [theme.breakpoints.down('md')]: {
            paddingLeft: 0,
            paddingRight: 0,
          },
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        padding: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 4,
          padding: '1rem 1.5rem',
          '&.Mui-focusVisible, &.Mui-selected': {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.2)}`,
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: ({ theme }) => ({
          fontSize: '2.8125rem',
          fontWeight: 400,
          [theme.breakpoints.down('md')]: {
            fontSize: '1.75rem',
          },
        }),
      },
    },
  },
};

export const DEFAULT_BRANDING: GetBrandingData = {
  logoUrl: null,
  tradeName: 'Wealth Avenue',
  brandColor: '#00876A',
  headerBgColor: '#fff',
};

/**
 * Create a theme for Go app
 */
export const createGoTheme = (
  branding: GetBrandingData = DEFAULT_BRANDING,
  theme: ThemeOptions = {}
) => {
  const brandedTheme: ThemeOptions = {
    palette: {
      primary: {
        main: branding.brandColor,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorDefault: {
            backgroundColor: branding.headerBgColor,
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          // override the default style of .logo-container class
          root: ({ theme }) => ({
            justifyContent: 'flex-start',
            '.logo-container': {
              height: 60,
              [theme.breakpoints.down('md')]: {
                height: 48,
              },
            },
          }),
        },
      },
    },
  };
  const EXTENDED_GO_THEME = deepmerge(GO_THEME, theme);
  const mergedTheme = deepmerge(brandedTheme, EXTENDED_GO_THEME);

  return createBambuTheme(mergedTheme);
};

export default createGoTheme;
