import type { ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import { alpha } from '../../index';
import createBambuTheme from '../utils/createBambuTheme/createBambuTheme';

export const DEFAULT_MOBILE_PREVIEW_THEME: ThemeOptions = {
  typography: {
    fontSize: 8,
  },
  spacing: 4,
  breakpoints: {
    values: {
      xs: 0,
      sm: 9999,
      md: 9999,
      lg: 9999,
      xl: 9999,
    },
  },
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 24,
          height: 24,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 80,
        },
        startIcon: {
          '& > *:nth-of-type(1)': {
            fontSize: 'inherit',
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 32,
          '.logo-container': {
            height: 28,
          },
          [theme.breakpoints.up('xs')]: {
            minHeight: 32,
            '.logo-container': {
              height: 28,
            },
          },
          '&.bottom-action': {
            display: 'none',
          },
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.up('xs')]: {
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
          },
        }),
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 0,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 4,
          padding: '0.5rem 0.75rem',
          '&.Mui-focusVisible, &.Mui-selected': {
            backgroundColor: `${alpha(theme.palette.primary.main, 0.2)}`,
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 28,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: ({ theme }) => ({
          [theme.breakpoints.up('xs')]: {
            fontSize: '1rem',
            fontWeight: 400,
          },
        }),
      },
    },
  },
};

/**
 * Create a theme for mobile preview
 */
export const createMobilePreviewTheme = (theme: ThemeOptions = {}) => {
  const mergedTheme = deepmerge(theme, DEFAULT_MOBILE_PREVIEW_THEME);

  return createBambuTheme(mergedTheme);
};

export default createMobilePreviewTheme;

function Form ( ) {
  [state, setState] = React.useState({name: '', email: ''});

  function onChange(e) {
    setState(e.target.value);
    ref.current.value = e.target.value;
  }

  return <form>

  <input onChange={onChange} ref={ref}/>
  </form>
}


function Test({classNames}) {

return <div className="red blue white mx-2 mx-4 {...clasnames} "></div>
}
