import type { ThemeOptions } from '@mui/material/styles';

import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

declare module '@mui/material/Slider' {
  interface SliderPropsSizeOverrides {
    big: true;
  }
}

export const ORIGINAL_BAMBU_THEME: ThemeOptions = {
  palette: {
    primary: {
      main: '#00876A',
    },
    secondary: {
      main: '#406376',
    },
    text: {
      primary: '#191C1B',
    },
    error: {
      main: '#BA1A1A',
    },
    background: {
      default: '#FAFAFA',
    },
    warning: {
      main: '#FFC025',
    },
  },
  typography: {
    fontFamily: ['Lato', 'Roboto', 'sans-serif'].join(','),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 905,
      lg: 1240,
      xl: 1440,
    },
  },
  components: {
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.grey['50'],
          '&.Mui-expanded': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.common.white,
          },
        }),
        expandIconWrapper: ({ theme }) => ({
          color: theme.palette.primary.main,
          '&.Mui-expanded': {
            color: 'inherit',
          },
        }),
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.common.white,
          padding: theme.spacing(4),
        }),
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: 'default',
        position: 'static',
        elevation: 1,
      },
      styleOverrides: {
        colorDefault: {
          backgroundColor: '#fff',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          textTransform: 'none',
          minWidth: 99,
        },
        contained: {
          boxShadow: 'none',
        },
        containedPrimary: {
          color: 'white',
        },
        text: {
          minWidth: 64,
        },
      },
      defaultProps: {
        variant: 'contained',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          height: 18,
          width: 18,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          justifyContent: 'flex-start',
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          paddingBottom: theme.spacing(2),
        }),
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 2,
        },
      },
      defaultProps: {
        elevation: 2,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow:
            '0px 1px 2px rgba(0, 0, 0, 0.05), 0px 1px 6px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow:
            '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 7px rgba(0, 0, 0, 0.15)',
        },
        elevation3: {
          boxShadow:
            '0px 1px 4px rgba(0, 0, 0, 0.15), 0px 1px 8px rgba(0, 0, 0, 0.2)',
        },
        elevation4: {
          boxShadow:
            '0px 1px 5px rgba(0, 0, 0, 0.2), 0px 1px 9px rgba(0, 0, 0, 0.25)',
        },
        elevation5: {
          boxShadow:
            '0px 2px 6px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiSlider: {
      defaultProps: {
        valueLabelDisplay: 'auto',
      },
      variants: [
        {
          props: { size: 'big' },
          style: {
            '.MuiSlider-thumb': {
              width: 44,
              height: 44,
            },
            '.MuiSlider-markLabel': {
              top: 44,
            },
          },
        },
      ],
    },
  },
};

/**
 * return mui-based bambu theme
 */
export const createBambuTheme = (extendedOptions: ThemeOptions = {}) => {
  return createTheme(deepmerge(ORIGINAL_BAMBU_THEME, extendedOptions));
};

export default createBambuTheme;
